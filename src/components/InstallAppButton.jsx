
"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iosDevice =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);

    setIsIOS(iosDevice);

    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.navigator.standalone === true;

      if (standalone) {
        setInstalled(true);
        setInstalling(false);
        setMessage("");
      }
    };

    checkInstalled();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleDisplayChange = () => {
      checkInstalled();
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleDisplayChange);
    } else {
      mediaQuery.addListener(handleDisplayChange);
    }

    // Register LIFEOS service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("LIFEOS Service Worker registered.");
        })
        .catch((error) => {
          console.error(
            "LIFEOS Service Worker registration failed:",
            error
          );
        });
    }

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstalling(false);
      setDeferredPrompt(null);
      setShowInstructions(false);
      setMessage("LIFEOS has been installed successfully!");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener("appinstalled", handleInstalled);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkInstalled();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pageshow", checkInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener("appinstalled", handleInstalled);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener("pageshow", checkInstalled);

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(
          "change",
          handleDisplayChange
        );
      } else {
        mediaQuery.removeListener(handleDisplayChange);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (installed || installing) return;

    if (deferredPrompt) {
      try {
        setInstalling(true);
        setMessage("Preparing your installation...");

        const promptEvent = deferredPrompt;
        setDeferredPrompt(null);

        await promptEvent.prompt();

        const choice = await promptEvent.userChoice;

        if (choice.outcome === "accepted") {
          setInstalling(false);
          setMessage(
            "Installation accepted. Check your home screen."
          );
        } else {
          setInstalling(false);
          setMessage(
            "Installation was cancelled. You can try again."
          );
        }
      } catch (error) {
        console.error("LIFEOS installation error:", error);
        setInstalling(false);
        setMessage("Unable to install. Please try again.");
      }

      return;
    }

    setShowInstructions(true);
  };

  if (installed) {
    return (
      <InstallWrapper>
        <InstalledButton type="button" disabled>
          <CheckIcon>✓</CheckIcon>
          LIFEOS Installed
        </InstalledButton>

        <StatusText>
          LIFEOS is installed on your device.
        </StatusText>
      </InstallWrapper>
    );
  }

  return (
    <InstallWrapper>
      <InstallButton
        type="button"
        onClick={handleInstall}
        disabled={installing}
      >
        {installing ? (
          <>
            <Spinner />
            Installing...
          </>
        ) : (
          <>
            <DownloadIcon>↓</DownloadIcon>
            Install LIFEOS
          </>
        )}
      </InstallButton>

      {installing && (
        <ProgressContainer>
          <ProgressTrack>
            <ProgressBar />
          </ProgressTrack>

          <ProgressText>
            {message || "Processing installation..."}
          </ProgressText>
        </ProgressContainer>
      )}

      {!installing && message && (
        <StatusText role="status" aria-live="polite">
          {message}
        </StatusText>
      )}

      {showInstructions && (
        <ModalOverlay
          onClick={() => setShowInstructions(false)}
        >
          <InstructionsModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              type="button"
              aria-label="Close instructions"
              onClick={() => setShowInstructions(false)}
            >
              ×
            </CloseButton>

            <ModalIcon>📲</ModalIcon>

            <h3 id="install-heading">
              Install LIFEOS App
            </h3>

            <p>
              Add LIFEOS to your phone's home screen for
              faster and easier access to your life management
              dashboard.
            </p>

            {isIOS ? (
              <InstructionSteps>
                <li>Open LIFEOS in Safari.</li>
                <li>Tap the Share icon.</li>
                <li>Select "Add to Home Screen".</li>
                <li>Tap "Add" to complete installation.</li>
              </InstructionSteps>
            ) : (
              <InstructionSteps>
                <li>Open your browser menu (⋮).</li>
                <li>
                  Select "Install app" or "Add to Home screen".
                </li>
                <li>Confirm the installation.</li>
              </InstructionSteps>
            )}

            <ModalButton
              type="button"
              onClick={() => setShowInstructions(false)}
            >
              Got It
            </ModalButton>
          </InstructionsModal>
        </ModalOverlay>
      )}
    </InstallWrapper>
  );
}

/* ===================== ANIMATIONS ===================== */

const moveProgress = keyframes`
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(250%);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* ===================== WRAPPER ===================== */

const InstallWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

/* ===================== INSTALL BUTTON ===================== */

const InstallButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: linear-gradient(135deg, #7059f5, #477eea);
  color: #f8faff;
  border: 1px solid #8574ff;

  padding: 13px 24px;
  border-radius: 12px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
  transition: 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(112, 89, 245, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

/* ===================== INSTALLED BUTTON ===================== */

const InstalledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;

  background: #162d28;
  color: #4ade80;
  border: 1px solid #22c55e;

  padding: 13px 24px;
  border-radius: 12px;

  font-size: 14px;
  font-weight: 700;
  cursor: default;
`;

const CheckIcon = styled.span`
  font-size: 20px;
`;

const DownloadIcon = styled.span`
  font-size: 22px;
`;

/* ===================== SPINNER ===================== */

const Spinner = styled.span`
  width: 17px;
  height: 17px;

  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;

  border-radius: 50%;

  animation: ${spin} 0.7s linear infinite;
`;

/* ===================== PROGRESS BAR ===================== */

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 280px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;

  background: #293750;
  border-radius: 20px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: 40%;

  background: #7059f5;
  border-radius: 20px;

  animation: ${moveProgress} 1.2s ease-in-out infinite;
`;

const ProgressText = styled.p`
  font-size: 12px;
  color: #8997b0;
  text-align: center;
  margin-top: 8px;
`;

/* ===================== STATUS ===================== */

const StatusText = styled.p`
  color: #4ade80;
  font-size: 12px;
  text-align: center;
  margin: 0;
`;

/* ===================== MODAL ===================== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;

  background: rgba(0, 0, 0, 0.8);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
`;

const InstructionsModal = styled.div`
  position: relative;

  background: #131e33;
  color: #f8faff;

  width: 100%;
  max-width: 400px;

  padding: 30px;
  border: 1px solid #293750;
  border-radius: 18px;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

  h3 {
    margin: 12px 0;
    font-size: 22px;
  }

  p {
    color: #8997b0;
    line-height: 1.6;
  }
`;

const ModalIcon = styled.div`
  font-size: 35px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  top: 10px;

  border: none;
  background: none;

  font-size: 27px;
  color: #8997b0;

  cursor: pointer;
`;

const InstructionSteps = styled.ol`
  padding-left: 22px;
  line-height: 2;

  color: #cbd5e1;

  margin: 20px 0;
`;

const ModalButton = styled.button`
  width: 100%;

  padding: 13px;

  border: none;
  border-radius: 10px;

  background: linear-gradient(135deg, #7059f5, #477eea);
  color: #ffffff;

  font-weight: 700;
  cursor: pointer;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
