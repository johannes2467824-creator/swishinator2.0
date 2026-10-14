/* Swishinator demo History layout add-on.
   Works with the existing pages.history and demoHistoryList in main.js.
   Does not modify payment, navigation, or confirmation UI. */
(() => {
  'use strict';
  const STORAGE_KEY = 'swishinatorDemoHistory';
  let activeFilter = 'all';

  // Preserve the existing payment-history save function and enrich new entries
  // with a timestamp. Previously saved transactions remain intact.
  const originalSave = window.saveDemoTransaction;
  if (typeof originalSave === 'function') {
    window.saveDemoTransaction = function (transaction) {
      originalSave(transaction);
      try {
        const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (Array.isArray(entries) && entries.length) {
          entries[0].createdAt = new Date().toISOString();
          entries[0].direction = 'sent';
          localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        }
      } catch (err) {
        console.warn('Could not add demo transaction date:', err);
      }
    };
  }

  function entries() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function directionOf(item) {
    return item.direction === 'received' || item.type === 'received' ? 'received' : 'sent';
  }

  function dateLabel(item) {
    const raw = item.createdAt || item.timestamp || item.date;
    if (!raw) return 'Earlier'; // Older demo transactions didn't store a date.
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return 'Earlier';
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const days = Math.round((start - dStart) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return d.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', ...(d.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {})
    });
  }

  function amountLabel(item) {
    let raw = String(item.amount ?? '0').trim();
    if (!raw) raw = '0';
    const received = directionOf(item) === 'received';
    raw = raw.replace(/^[-+\s]+/, '').trim();
    if (!/\bkr\b/i.test(raw)) raw += ' kr';
    return (received ? '' : '-') + raw;
  }

  function initials(name) {
    const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?')[0]).toUpperCase();
  }

  function avatarClass(name) {
    const colors = ['violet', 'amber', 'teal', 'blue', 'rose'];
    let hash = 0;
    for (const char of String(name)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return colors[hash % colors.length];
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showDetail(item) {
    const shell = document.querySelector('.sh-shell');
    if (!shell) return;
    const overlay = el('div', 'sh-detail-backdrop');
    const dialog = el('section', 'sh-detail');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Demo transaction details');
    dialog.append(el('div', 'sh-detail-kicker', 'Demo transaction'));
    dialog.append(el('h2', '', item.name || 'Unknown recipient'));
    const details = [
      ['Phone number', item.phone || 'Not provided'],
      ['Amount', amountLabel(item)],
      ['Date', dateLabel(item)],
      ['Type', directionOf(item) === 'received' ? 'Received' : 'Sent']
    ];
    for (const [label, value] of details) {
      const line = el('div', 'sh-detail-line');
      line.append(el('span', '', label), el('strong', '', value));
      dialog.append(line);
    }
    const close = el('button', 'sh-detail-close', 'Close');
    close.type = 'button';
    close.addEventListener('click', () => overlay.remove());
    dialog.append(close);
    overlay.append(dialog);
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    shell.append(overlay);
    close.focus();
  }

  function buildRow(item) {
    const received = directionOf(item) === 'received';
    const name = String(item.name || 'Unknown recipient');
    const button = el('button', 'sh-row');
    button.type = 'button';
    button.setAttribute('aria-label', `${name}, ${amountLabel(item)}, ${dateLabel(item)}. View details`);
    const avatar = el('span', `sh-avatar sh-avatar-${avatarClass(name)}`, initials(name));
    if (/\b(caf[eé]|butik|ab|store|shop|restaurant)\b/i.test(name)) avatar.classList.add('sh-avatar-company');
    const main = el('span', 'sh-row-main');
    const info = el('span', 'sh-row-info');
    info.append(el('span', 'sh-row-name', name), el('span', 'sh-row-date', dateLabel(item)));
    const right = el('span', 'sh-row-right');
    right.append(el('span', `sh-row-amount${received ? ' is-received' : ''}`, amountLabel(item)));
    const arrow = el('span', 'sh-row-arrow', '›');
    arrow.setAttribute('aria-hidden', 'true');
    right.append(arrow);
    main.append(info, right);
    button.append(avatar, main);
    button.addEventListener('click', () => showDetail(item));
    return button;
  }

  function fillList() {
    const list = document.querySelector('#demoHistoryList .sh-rows');
    if (!list) return;
    list.replaceChildren();
    const data = entries().filter(item => activeFilter === 'all' || directionOf(item) === activeFilter);
    if (!data.length) {
      const empty = el('div', 'sh-empty');
      empty.append(el('h2', '', activeFilter === 'received' ? 'No received payments' : activeFilter === 'sent' ? 'No sent payments' : 'No activity yet'));
      empty.append(el('p', '', activeFilter === 'received' ? 'Received demo transactions will appear here.' : 'Completed demo payments will appear here.'));
      list.append(empty);
      return;
    }
    for (const item of data) list.append(buildRow(item));
  }

  function renderHistoryLayout() {
    const container = document.getElementById('demoHistoryList');
    if (!container) return;
    const panel = document.getElementById('panel');
    // The existing template has an H1 immediately before the history list.
    if (panel) {
      const heading = panel.querySelector('h1');
      if (heading && heading.textContent.trim() === 'History') heading.remove();
    }
    container.replaceChildren();
    const shell = el('div', 'sh-shell');
    const header = el('header', 'sh-header');
    const more = el('button', 'sh-more', '•••');
    more.type = 'button';
    more.setAttribute('aria-label', 'History options');
    more.addEventListener('click', () => {
      if (confirm('Clear all saved demo transactions from this device?')) {
        localStorage.removeItem(STORAGE_KEY);
        fillList();
      }
    });
    header.append(more, el('h1', 'sh-title', 'History'));
    const tabs = el('div', 'sh-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Filter demo history');
    for (const [value, label] of [['all', 'All'], ['received', 'Received'], ['sent', 'Sent']]) {
      const tab = el('button', 'sh-filter' + (activeFilter === value ? ' is-active' : ''), label);
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(activeFilter === value));
      tab.addEventListener('click', () => {
        activeFilter = value;
        for (const btn of tabs.querySelectorAll('.sh-filter')) {
          const selected = btn === tab;
          btn.classList.toggle('is-active', selected);
          btn.setAttribute('aria-selected', String(selected));
        }
        fillList();
      });
      tabs.append(tab);
    }
    header.append(tabs);
    const scroller = el('div', 'sh-scroller');
    scroller.append(el('div', 'sh-rows'));
    shell.append(header, scroller);
    container.append(shell);
    fillList();
  }

  // main.js calls renderDemoHistory() when the History tab is opened.
  // Replace just that rendering function; all other main.js behavior stays intact.
  window.renderDemoHistory = renderHistoryLayout;
  if (document.getElementById('demoHistoryList')) renderHistoryLayout();
})();
