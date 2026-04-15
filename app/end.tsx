import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  Share,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Storage } from '@lib/storage';
import { fetchAndStoreRandomWish } from '@lib/fetchWish';
import { stopSpeech } from '@lib/speechManager';
import {
  getSendState,
  startSendWithRetry,
  retryOnceSend,
  SendState,
  MAX_SEND_RETRIES,
} from '@lib/sendWish';
import { WishInputComponent } from '@cmp/WishInputComponent';
import { CreatorCard } from '@cmp/CreatorCard';
import { EndStyles } from '@stylez';

const IMG_GINIE        = require('@img/in/ginie.png');
const IMG_BLUE_MERMAID = require('@img/in/blue_mermaid.png');
const IMG_RED_MERMAID  = require('@img/in/red_mermaid.png');

type Tab = 'random' | 'my';

function getCharacterSource(ginie: number): ImageSourcePropType {
  if (ginie === 1) return IMG_GINIE;
  if (ginie === 2) return IMG_BLUE_MERMAID;
  return IMG_RED_MERMAID;
}

function formatTimestamp(ms: number): string {
  if (!ms || isNaN(ms)) return '';
  try {
    return new Date(ms).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function EndScreen() {
  const [ginie, setGinie]               = useState<number | null>(null);
  const [showInput, setShowInput]       = useState(false);
  const [activeTab, setActiveTab]       = useState<Tab>('random');

  const [rnote, setRnote]               = useState('');
  const [rnotefrom, setRnotefrom]       = useState('');
  const [rnoteat, setRnoteat]           = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError]     = useState('');

  const [mynote, setMynote]             = useState('');
  const [sendState, setSendState]       = useState<SendState>(getSendState());
  const [sendRetrying, setSendRetrying] = useState(false);

  const sendRetryRef = useRef(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (Platform.OS === 'android') {
        ToastAndroid.show('No going back now. 🌀', ToastAndroid.SHORT);
      }
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const released = Storage.getBoolean('isginiereleased');
    if (released !== true) {
      router.replace('/main');
      return;
    }

    const storedGinie = Storage.getNumber('ginie');
    if (storedGinie === undefined) {
      router.replace('/main');
      return;
    }

    setGinie(storedGinie);

    const completed = Storage.getBoolean('iscompleted');
    if (completed !== true) {
      setShowInput(true);
    } else {
      loadNotes();
      doFetchRandomWish();
      triggerSendRetry();
    }
  }, []);

  function loadNotes() {
    setRnote(Storage.getString('rnote') ?? '');
    setRnotefrom(Storage.getString('rnotefrom') ?? '');
    setRnoteat(Storage.getString('rnoteat') ?? '');
    setMynote(Storage.getString('mynote') ?? '');
    setSendState(getSendState());
  }

  async function doFetchRandomWish() {
    setFetchLoading(true);
    setFetchError('');
    const result = await fetchAndStoreRandomWish();
    if (result.ok) {
      setRnote(Storage.getString('rnote') ?? '');
      setRnotefrom(Storage.getString('rnotefrom') ?? '');
      setRnoteat(Storage.getString('rnoteat') ?? '');
      setFetchError('');
    } else {
      setFetchError(result.errorReason ?? 'Something went wrong.');
    }
    setFetchLoading(false);
  }

  async function triggerSendRetry() {
    if (sendRetryRef.current) return;
    sendRetryRef.current = true;
    setSendRetrying(true);

    await startSendWithRetry(() => {
      setSendState(getSendState());
    });

    setSendRetrying(false);
    setSendState(getSendState());
    sendRetryRef.current = false;
  }

  const handleInputDone = useCallback(() => {
    setShowInput(false);
    loadNotes();
    doFetchRandomWish();
    triggerSendRetry();
  }, []);

  async function handleManualRetrySend() {
    if (sendRetryRef.current) return;
    sendRetryRef.current = true;
    setSendRetrying(true);
    await retryOnceSend(() => setSendState(getSendState()));
    setSendRetrying(false);
    setSendState(getSendState());
    sendRetryRef.current = false;
  }

  async function handleShare() {
    try {
      const wish = Storage.getString('mywish') ?? '';
      const parts: string[] = [];
      if (wish) parts.push(`My wish: "${wish}"`);
      if (mynote) parts.push(`My note: "${mynote}"`);
      parts.push('Released with Scream2Wish — https://rajnishkmehta.github.io/Scream2Wish');
      await Share.share({ message: parts.join('\n\n') });
    } catch {
      // user cancelled
    }
  }

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (ginie === null) {
    return <View style={EndStyles.screen} />;
  }

  const characterSource = getCharacterSource(ginie);

  if (showInput) {
    return (
      <WishInputComponent
        characterSource={characterSource}
        onDone={handleInputDone}
      />
    );
  }

  const rnoteatMs = Number(rnoteat);
  const rnoteatFormatted = formatTimestamp(rnoteatMs);
  const completed = Storage.getBoolean('iscompleted') === true;

  const showRetryBtn =
    !sendRetrying && !sendState.issent && (sendState.maxed || sendState.unauthorized);

  return (
    <ScrollView
      style={EndStyles.screen}
      contentContainerStyle={EndStyles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={characterSource}
        style={EndStyles.characterImage}
        resizeMode="contain"
      />

      <View style={EndStyles.tabBar}>
        <TouchableOpacity
          style={[EndStyles.tabItem, activeTab === 'random' && EndStyles.tabItemActive]}
          onPress={() => setActiveTab('random')}
          activeOpacity={0.7}
        >
          <Text style={[EndStyles.tabLabel, activeTab === 'random' && EndStyles.tabLabelActive]}>
            Random Note
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[EndStyles.tabItem, activeTab === 'my' && EndStyles.tabItemActive]}
          onPress={() => setActiveTab('my')}
          activeOpacity={0.7}
        >
          <Text style={[EndStyles.tabLabel, activeTab === 'my' && EndStyles.tabLabelActive]}>
            My Note
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'random' && (
        <View style={EndStyles.noteCard}>
          <Text style={EndStyles.noteSectionLabel}>Note For You</Text>

          {fetchLoading ? (
            <View style={EndStyles.fetchLoadingWrap}>
              <ActivityIndicator color="#ef4444" size="small" />
              <Text style={EndStyles.fetchLoadingText}>Finding a note for you...</Text>
            </View>
          ) : rnote ? (
            <>
              <Text style={EndStyles.noteText}>{rnote}</Text>
              <View style={EndStyles.noteMetaRow}>
                {rnotefrom ? (
                  <Text style={EndStyles.noteMetaText}>{rnotefrom}</Text>
                ) : null}
                {rnotefrom && rnoteatFormatted ? (
                  <View style={EndStyles.noteDivider} />
                ) : null}
                {rnoteatFormatted ? (
                  <Text style={EndStyles.noteMetaText}>{rnoteatFormatted}</Text>
                ) : null}
              </View>
            </>
          ) : (
            <>
              <Text style={EndStyles.fetchErrorText}>
                {fetchError || 'Could not load a note from the universe.'}
              </Text>
              <TouchableOpacity
                style={EndStyles.retryBtn}
                onPress={doFetchRandomWish}
                activeOpacity={0.8}
              >
                <Text style={EndStyles.retryBtnText}>Try again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {activeTab === 'my' && (
        <View style={EndStyles.noteCard}>
          <Text style={EndStyles.noteSectionLabel}>Your note</Text>

          {mynote ? (
            <Text style={EndStyles.noteText}>{mynote}</Text>
          ) : (
            <Text style={EndStyles.fetchErrorText}>You did not leave a note.</Text>
          )}

          <View style={EndStyles.sendStatusWrap}>
            {sendState.issent ? (
              <View style={EndStyles.sendStatusRow}>
                <View style={[EndStyles.sendDot, EndStyles.sendDotGreen]} />
                <Text style={EndStyles.sendStatusSent}>Shared with the world</Text>
              </View>
            ) : sendRetrying ? (
              <View style={EndStyles.sendStatusRow}>
                <ActivityIndicator color="#f59e0b" size="small" style={{ marginRight: 8 }} />
                <Text style={EndStyles.sendStatusRetrying}>
                  Sending... ({sendState.attempts}/{MAX_SEND_RETRIES})
                </Text>
              </View>
            ) : sendState.unauthorized ? (
              <>
                <View style={EndStyles.sendStatusRow}>
                  <View style={[EndStyles.sendDot, EndStyles.sendDotAmber]} />
                  <Text style={EndStyles.sendStatusError}>
                    Server rejected the request (unauthorized).
                  </Text>
                </View>
                {showRetryBtn && (
                  <TouchableOpacity
                    style={EndStyles.retryBtn}
                    onPress={handleManualRetrySend}
                    activeOpacity={0.8}
                  >
                    <Text style={EndStyles.retryBtnText}>Retry send</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : sendState.maxed ? (
              <>
                <View style={EndStyles.sendStatusRow}>
                  <View style={[EndStyles.sendDot, EndStyles.sendDotRed]} />
                  <Text style={EndStyles.sendStatusError} numberOfLines={3}>
                    {sendState.lastError || 'Failed to send after 6 tries.'}
                  </Text>
                </View>
                {showRetryBtn && (
                  <TouchableOpacity
                    style={EndStyles.retryBtn}
                    onPress={handleManualRetrySend}
                    activeOpacity={0.8}
                  >
                    <Text style={EndStyles.retryBtnText}>Retry send</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : sendState.attempts > 0 ? (
              <View style={EndStyles.sendStatusRow}>
                <View style={[EndStyles.sendDot, EndStyles.sendDotAmber]} />
                <Text style={EndStyles.sendStatusRetrying}>Waiting to send...</Text>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {completed ? (
        <TouchableOpacity
          style={EndStyles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={EndStyles.shareBtnText}>Share my wish</Text>
        </TouchableOpacity>
      ) : null}

      <CreatorCard rnoteLoaded={rnote !== ''} />
    </ScrollView>
  );
}
