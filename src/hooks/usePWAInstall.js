import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Check if running as standalone PWA
    const checkStandalone = () => {
      const matchStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const navigatorStandalone = window.navigator.standalone === true;
      setIsStandalone(matchStandalone || navigatorStandalone);
    };

    checkStandalone();

    // Check for iOS Safari
    const ua = window.navigator.userAgent;
    const isIphoneOrIpad = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
    setIsIOS(isIphoneOrIpad);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsStandalone(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      // Show modal for iOS or manual instructions
      setShowModal(true);
    }
  };

  return {
    isInstallable,
    isStandalone,
    isIOS,
    showModal,
    setShowModal,
    triggerInstall,
  };
}
