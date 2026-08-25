// ==========================================================================
// Real-Time Multiplayer Lobby & Room Matchmaking Service
// Simulated WebSockets/Firebase live room manager
// ==========================================================================

export class MultiplayerLobby {
  constructor() {
    this.currentRoom = null;
    this.listeners = [];
  }

  // Create a custom private room with a code
  createRoom(hostName, hostElo) {
    const roomCode = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
    this.currentRoom = {
      code: roomCode,
      status: 'waiting', // 'waiting' | 'connected'
      host: { name: hostName, elo: hostElo, color: 'w' },
      guest: null,
      messages: []
    };
    return this.currentRoom;
  }

  // Join existing room by code
  joinRoom(roomCode, guestName, guestElo) {
    if (!roomCode || roomCode.length < 4) {
      return { success: false, error: 'Código de sala inválido.' };
    }

    this.currentRoom = {
      code: roomCode.toUpperCase(),
      status: 'connected',
      host: { name: 'GranMaestro_Online', elo: guestElo + 15, color: 'w' },
      guest: { name: guestName, elo: guestElo, color: 'b' },
      messages: [{ sender: 'Sistema', text: '¡Jugador conectado a la sala privada!' }]
    };

    return { success: true, room: this.currentRoom };
  }

  // Quick Matchmaking search simulation
  quickMatch(userName, userElo, onFound) {
    setTimeout(() => {
      const opponents = [
        { name: 'Karpovian_99', elo: userElo + 12 },
        { name: 'QueenRider_2026', elo: userElo - 8 },
        { name: 'TacticalWizard', elo: userElo + 25 },
        { name: 'ChessMaster_Arg', elo: userElo }
      ];
      const match = opponents[Math.floor(Math.random() * opponents.length)];
      onFound(match);
    }, 2200);
  }
}

export const multiplayerLobby = new MultiplayerLobby();
