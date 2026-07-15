(function attachDivisionAvailability(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DivisionAvailability = api;
})(typeof window !== "undefined" ? window : undefined, function createApi() {
  const FULL_MESSAGE = "This team is full! Please choose another!";

  function isFullPill(pill) {
    return pill?.dataset?.availability === "full";
  }

  function rememberDefault(error) {
    if (!error || error.dataset.defaultMessage) return;
    const text = error.querySelector(".error-text");
    error.dataset.defaultMessage = text?.textContent || "";
  }

  function showUnavailable(errorOrSelector) {
    const error = typeof errorOrSelector === "string"
      ? document.querySelector(errorOrSelector)
      : errorOrSelector;
    if (!error) return;
    rememberDefault(error);
    const text = error.querySelector(".error-text");
    if (text) text.textContent = FULL_MESSAGE;
    error.classList.add("visible");
  }

  function resetMessage(error) {
    if (!error) return;
    rememberDefault(error);
    const text = error.querySelector(".error-text");
    if (text) text.textContent = error.dataset.defaultMessage;
    error.classList.remove("visible");
  }

  function bindPill(pill, error) {
    pill.addEventListener("click", (event) => {
      if (!isFullPill(pill)) {
        resetMessage(error);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      showUnavailable(error);
    }, true);
  }

  function clearUnavailableAutosave(pills, storageKey) {
    const saved = sessionStorage.getItem(storageKey);
    const stale = pills.some((pill) => isFullPill(pill) && pill.dataset.division === saved);
    if (stale) sessionStorage.removeItem(storageKey);
  }

  function bindSubmit(submit, pills, error) {
    submit?.addEventListener("click", (event) => {
      const selectedFull = pills.some(
        (pill) => isFullPill(pill) && pill.classList.contains("selected"),
      );
      if (!selectedFull) {
        resetMessage(error);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      showUnavailable(error);
    }, true);
  }

  function initPage({ pillSelector, errorSelector, submitSelector, storageKey }) {
    const pills = Array.from(document.querySelectorAll(pillSelector));
    if (!pills.length) return;
    const error = document.querySelector(errorSelector);
    rememberDefault(error);
    clearUnavailableAutosave(pills, storageKey);
    pills.forEach((pill) => bindPill(pill, error));
    bindSubmit(document.querySelector(submitSelector), pills, error);
  }

  function init() {
    initPage({
      pillSelector: ".office-pill",
      errorSelector: ".office-error",
      submitSelector: "#btnSaveOffice",
      storageKey: "reg_autosave_office",
    });
    initPage({
      pillSelector: ".sb-pill",
      errorSelector: ".sb-error",
      submitSelector: "#btnSaveSB",
      storageKey: "reg_autosave_sb",
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }

  return { FULL_MESSAGE, bindPill, isFullPill, resetMessage, showUnavailable };
});
