import { redirect } from 'next/navigation';
import { requireAuth, getUserProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/LogoutButton';
import PlayerList from '@/components/PlayerList';
import MatchRequestActions from '@/components/MatchRequestActions';

/**
 * Dashboard Page (Server Component)
 * 
 * This is the main page users see after logging in. It displays:
 * - A list of all online players
 * - Each player's name, skill level, and location
 * - A "Request Match" button for each player
 * 
 * Only authenticated users can access this page.
 */
export default async function DashboardPage() {
  // This will redirect to /login if not authenticated
  const user = await requireAuth();
  const profile = await getUserProfile();
  
  // Get all online players (excluding the current user)
  const supabase = await createClient();
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .eq('is_online', true)
    .neq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-neutral border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">Padel Connect</h1>
              <p className="text-sm text-gray-600">Welcome, {profile?.name || 'Player'}!</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-heading font-bold text-neutral mb-2">
            Online Players
          </h2>
          <p className="text-gray-400">
            Find players to match with and start playing padel!
          </p>
        </div>

        {/* Player List */}
        {players && players.length > 0 ? (
          <PlayerList players={players} currentUserId={user.id} />
        ) : (
          <div className="bg-neutral rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No other players online at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon to find matches!</p>
          </div>
        )}

        {/* Match Requests Section */}
        <div className="mt-8">
          <MatchRequestsSection currentUserId={user.id} />
        </div>
      </main>
    </div>
  );
}

/**
 * Match Requests Section
 * Shows incoming and outgoing match requests
 */
async function MatchRequestsSection({ currentUserId }: { currentUserId: string }) {
  const supabase = await createClient();

  // Get incoming requests (requests sent TO current user)
  const { data: incomingRequestsData } = await supabase
    .from('match_requests')
    .select('*')
    .eq('receiver_id', currentUserId)
    .eq('status', 'pending');

  // Get outgoing requests (requests sent BY current user)
  const { data: outgoingRequestsData } = await supabase
    .from('match_requests')
    .select('*')
    .eq('sender_id', currentUserId)
    .eq('status', 'pending');

  // Collect all user IDs we need to fetch
  const userIdsToFetch = new Set<string>();
  (incomingRequestsData || []).forEach((req: any) => userIdsToFetch.add(req.sender_id));
  (outgoingRequestsData || []).forEach((req: any) => userIdsToFetch.add(req.receiver_id));

  // Fetch all player profiles in one query
  const { data: allPlayers } = await supabase
    .from('players')
    .select('*')
    .in('user_id', Array.from(userIdsToFetch));

  // Create a map for quick lookup
  const playersMap = new Map((allPlayers || []).map((p: any) => [p.user_id, p]));

  // Attach player profiles to requests
  const incomingRequests = (incomingRequestsData || []).map((request: any) => ({
    ...request,
    sender: playersMap.get(request.sender_id),
  }));

  const outgoingRequests = (outgoingRequestsData || []).map((request: any) => ({
    ...request,
    receiver: playersMap.get(request.receiver_id),
  }));

  const hasRequests = (incomingRequests && incomingRequests.length > 0) || 
                      (outgoingRequests && outgoingRequests.length > 0);

  if (!hasRequests) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Incoming Requests */}
      {incomingRequests && incomingRequests.length > 0 && (
        <div>
          <h3 className="text-xl font-heading font-semibold text-neutral mb-4">
            Incoming Match Requests
          </h3>
          <div className="space-y-3">
            {incomingRequests.map((request: any) => (
              <MatchRequestCard
                key={request.id}
                request={request}
                type="incoming"
                player={request.sender}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outgoing Requests */}
      {outgoingRequests && outgoingRequests.length > 0 && (
        <div>
          <h3 className="text-xl font-heading font-semibold text-neutral mb-4">
            Your Match Requests
          </h3>
          <div className="space-y-3">
            {outgoingRequests.map((request: any) => (
              <MatchRequestCard
                key={request.id}
                request={request}
                type="outgoing"
                player={request.receiver}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Match Request Card Component
 */
function MatchRequestCard({ request, type, player }: { request: any; type: 'incoming' | 'outgoing'; player: any }) {
  return (
    <div className="bg-neutral rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <p className="font-medium text-dark">
          {type === 'incoming' ? `${player?.name} wants to play with you` : `You requested to play with ${player?.name}`}
        </p>
        <p className="text-sm text-gray-600">{player?.skill_level} • {player?.location}</p>
      </div>
      {type === 'incoming' && (
        <MatchRequestActions requestId={request.id} senderId={request.sender_id} />
      )}
      {type === 'outgoing' && (
        <span className="text-sm text-gray-500">Waiting for response...</span>
      )}
    </div>
  );
}

