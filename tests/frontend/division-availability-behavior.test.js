const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const modulePath = path.join(root, "frontend/js/division-availability.js");

function classList(initial = []) {
  const values = new Set(initial);
  return {
    add: (value) => values.add(value),
    remove: (value) => values.delete(value),
    contains: (value) => values.has(value),
  };
}

function eventTarget(properties = {}) {
  const listeners = new Map();
  return {
    ...properties,
    addEventListener(type, handler, capture = false) {
      const handlers = listeners.get(type) || [];
      handlers.push({ handler, capture });
      listeners.set(type, handlers);
    },
    dispatch(type, event = {}) {
      const dispatched = {
        defaultPrevented: false,
        immediatePropagationStopped: false,
        preventDefault() { this.defaultPrevented = true; },
        stopImmediatePropagation() { this.immediatePropagationStopped = true; },
        ...event,
      };
      const handlers = [...(listeners.get(type) || [])].sort((a, b) => Number(b.capture) - Number(a.capture));
      for (const { handler } of handlers) {
        handler(dispatched);
        if (dispatched.immediatePropagationStopped) break;
      }
      return dispatched;
    },
  };
}

function errorRegion(defaultMessage = "Choose a division") {
  const text = { textContent: defaultMessage };
  return {
    dataset: { defaultMessage },
    classList: classList(),
    querySelector: () => text,
    text,
  };
}

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test("full pointer activation is blocked without changing selection or autosave", () => {
  const { FULL_MESSAGE, bindPill } = require(modulePath);
  const pill = eventTarget({
    dataset: { availability: "full", division: "Marketing" },
    classList: classList(),
  });
  const error = errorRegion();
  const saved = storage({ reg_autosave_office: "Relations" });
  let selectedDivision = "Relations";

  bindPill(pill, error);
  pill.addEventListener("click", () => {
    pill.classList.add("selected");
    selectedDivision = pill.dataset.division;
    saved.setItem("reg_autosave_office", selectedDivision);
  });
  const event = pill.dispatch("click", { pointerType: "mouse" });

  assert.equal(error.text.textContent, FULL_MESSAGE);
  assert.equal(error.text.textContent, "This team is full! Please choose another!");
  assert.equal(error.classList.contains("visible"), true);
  assert.equal(event.defaultPrevented, true);
  assert.equal(event.immediatePropagationStopped, true);
  assert.equal(pill.classList.contains("selected"), false);
  assert.equal(selectedDivision, "Relations");
  assert.equal(saved.getItem("reg_autosave_office"), "Relations");
});

test("Enter and Space activation of a full button are blocked", async (t) => {
  const { bindPill } = require(modulePath);

  for (const key of ["Enter", " "]) {
    await t.test(key === " " ? "Space" : key, () => {
      const pill = eventTarget({
        dataset: { availability: "full", division: "Software & Web Dev." },
        classList: classList(),
      });
      const error = errorRegion();
      let pageHandlerCalls = 0;

      bindPill(pill, error);
      pill.addEventListener("click", () => { pageHandlerCalls += 1; });
      const event = pill.dispatch("click", { key, keyboardGenerated: true });

      assert.equal(event.defaultPrevented, true);
      assert.equal(event.immediatePropagationStopped, true);
      assert.equal(pageHandlerCalls, 0);
      assert.equal(error.text.textContent, "This team is full! Please choose another!");
    });
  }
});

test("available activation clears availability feedback and reaches the page handler", () => {
  const { FULL_MESSAGE, bindPill } = require(modulePath);
  const pill = eventTarget({
    dataset: { division: "Relations" },
    classList: classList(),
  });
  const error = errorRegion();
  error.text.textContent = FULL_MESSAGE;
  error.classList.add("visible");
  const saved = storage();
  let selectedDivision = null;

  bindPill(pill, error);
  pill.addEventListener("click", () => {
    pill.classList.add("selected");
    selectedDivision = pill.dataset.division;
    saved.setItem("reg_autosave_office", selectedDivision);
  });
  const event = pill.dispatch("click");

  assert.equal(event.defaultPrevented, false);
  assert.equal(event.immediatePropagationStopped, false);
  assert.equal(error.text.textContent, "Choose a division");
  assert.equal(error.classList.contains("visible"), false);
  assert.equal(pill.classList.contains("selected"), true);
  assert.equal(selectedDivision, "Relations");
  assert.equal(saved.getItem("reg_autosave_office"), "Relations");
});

test("initialization clears stale full autosave and blocks a manually selected full pill", () => {
  const source = fs.readFileSync(modulePath, "utf8");
  const fullPill = eventTarget({
    dataset: { availability: "full", division: "Marketing" },
    classList: classList(),
  });
  const openPill = eventTarget({
    dataset: { division: "Relations" },
    classList: classList(),
  });
  const error = errorRegion();
  const submit = eventTarget();
  const saved = storage({ reg_autosave_office: "Marketing" });
  const document = {
    readyState: "complete",
    querySelectorAll(selector) {
      if (selector === ".office-pill") return [fullPill, openPill];
      if (selector === ".sb-pill") return [];
      return [];
    },
    querySelector(selector) {
      if (selector === ".office-error") return error;
      if (selector === "#btnSaveOffice") return submit;
      return null;
    },
  };

  vm.runInNewContext(source, { document, sessionStorage: saved, window: {} });
  assert.equal(saved.getItem("reg_autosave_office"), null);

  fullPill.classList.add("selected");
  let pageSubmitCalls = 0;
  submit.addEventListener("click", () => { pageSubmitCalls += 1; });
  const event = submit.dispatch("click");

  assert.equal(event.defaultPrevented, true);
  assert.equal(event.immediatePropagationStopped, true);
  assert.equal(pageSubmitCalls, 0);
  assert.equal(error.text.textContent, "This team is full! Please choose another!");
});

test("page scripts route stale API division_unavailable responses to the shared helper", () => {
  for (const [file, selector] of [["office.js", ".office-error"], ["skillbuilder.js", ".sb-error"]]) {
    const source = fs.readFileSync(path.join(root, `frontend/js/${file}`), "utf8");
    assert.match(source, /function showSubmissionError\(payload\)/);
    assert.match(source, /payload\s*&&\s*payload\.code\s*===\s*["']division_unavailable["']/);
    assert.match(
      source,
      new RegExp(`DivisionAvailability\\.showUnavailable\\(["']${selector.replace(".", "\\.")}["']\\)`),
    );
    assert.match(source, /showSubmissionError\(payload\)/);
  }
});
