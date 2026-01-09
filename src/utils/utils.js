import _ from 'lodash';

export function ticketLabel(ticket) {
  if (!ticket) return '';
  return `${_.compact([ticket.ticketCode]).join(' ')}${
    ticket.ticketCode ? ` (${ticket.ticketCode})` : ''
  }`;
}

export function isBase64Encoded(str) {
  // Base64 encoded strings can only contain characters from [A-Za-z0-9+/=]
  const base64RegExp = /^[A-Za-z0-9+/=]+$/;
  return base64RegExp.test(str);
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Normalise une valeur "métier" vers une clé Enum backend / GraphQL
 *
 * Exemples :
 *  "Mensuel"        -> "MENSUEL"
 *  "Oui/Non"        -> "OUI_NON"
 *  "2 fois"         -> "DEUX_FOIS"
 *  "Protection sociale" -> "PROTECTION_SOCIALE"
 */
export function normalizeEnumValue(value, customMap) {
  if (!value) {
    return null;
  }

  // Normalisation de base
  let key = value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')                 // supprime accents
    .replace(/[\u0300-\u036f]/g, '')  // accents unicode
    .replace(/[^a-z0-9]+/g, '_')      // espaces, /, - → _
    .replace(/^_+|_+$/g, '')          // _ début/fin
    .toUpperCase();

  // Mapping spécifique optionnel
  if (customMap) {
    if (customMap[key]) {
      return customMap[key];
    }
    if (customMap[value]) {
      return customMap[value];
    }
  }

  return key;
}
