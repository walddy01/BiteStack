const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;

// TODO: TODO ESTO ES UN WORKARAOUND, PARA QUE FUNCIONE SUPABASE EN EXPO 53
// QUITAR EN CUANTO SUPABASE SOLUCIONE EL PROBLEMA