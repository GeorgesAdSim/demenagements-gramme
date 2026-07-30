import { useEffect } from 'react';
import { registerWebMcpTools } from '../lib/webmcp';

/**
 * Monte les outils WebMCP pour les agents IA. Ne rend rien et n'a aucun effet
 * sur les navigateurs qui n'exposent pas l'API — c'est-à-dire presque tous
 * aujourd'hui. Voir src/lib/webmcp.ts pour l'état de la technologie.
 */
export default function WebMcpTools() {
  useEffect(() => registerWebMcpTools(), []);
  return null;
}
