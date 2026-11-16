
"use client";

import { createGlobalStyle } from "styled-components";

const GlobalSwalStyle = createGlobalStyle`
  /* Main popup */
  .swal2-popup {
    background: #0b1220 !important;
    color: #f8faff !important;
    border: 1px solid #24324a !important;
    border-radius: 18px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
    font-family: Arial, Helvetica, sans-serif !important;
    padding: 28px !important;
  }

  /* Title */
  .swal2-title {
    color: #f8faff !important;
    font-size: 20px !important;
    font-weight: 700 !important;
  }

  /* Message text */
  .swal2-html-container {
    color: #aab7cc !important;
    font-size: 14px !important;
    line-height: 1.7 !important;
  }

  /* Input fields */
  .swal2-input,
  .swal2-textarea,
  .swal2-select {
    background: #080d1b !important;
    color: #ffffff !important;
    border: 1px solid #263650 !important;
    border-radius: 10px !important;
    box-shadow: none !important;
    font-size: 14px !important;
  }

  .swal2-input:focus,
  .swal2-textarea:focus,
  .swal2-select:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  }

  /* All buttons */
  .swal2-styled {
    border-radius: 10px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 11px 20px !important;
    box-shadow: none !important;
    transition: all 0.2s ease !important;
  }

  /* Confirm button */
  .swal2-styled.swal2-confirm {
    background: linear-gradient(
      135deg,
      #2563eb,
      #7c3aed
    ) !important;
    color: #ffffff !important;
  }

  .swal2-styled.swal2-confirm:hover {
    filter: brightness(1.15) !important;
    transform: translateY(-1px);
  }

  /* Cancel button */
  .swal2-styled.swal2-cancel {
    background: #1e293b !important;
    color: #cbd5e1 !important;
    border: 1px solid #334155 !important;
  }

  .swal2-styled.swal2-cancel:hover {
    background: #334155 !important;
  }

  /* Deny button */
  .swal2-styled.swal2-deny {
    background: #dc2626 !important;
    color: #ffffff !important;
  }

  /* Close button */
  .swal2-close {
    color: #94a3b8 !important;
  }

  .swal2-close:hover {
    color: #ffffff !important;
  }

  /* Validation messages */
  .swal2-validation-message {
    background: #1e293b !important;
    color: #f87171 !important;
    border-radius: 8px !important;
  }

  /* Backdrop */
  .swal2-container.swal2-backdrop-show {
    background: rgba(2, 6, 23, 0.75) !important;
    backdrop-filter: blur(4px) !important;
  }

  /* Toast notifications */
  .swal2-popup.swal2-toast {
    background: #0b1220 !important;
    border: 1px solid #24324a !important;
    border-radius: 12px !important;
  }

  .swal2-popup.swal2-toast .swal2-title,
  .swal2-popup.swal2-toast .swal2-html-container {
    color: #f8faff !important;
  }
`;

export default GlobalSwalStyle;
