import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import LiveMatchClient from '@/components/LiveMatchClient';

/**
 * Live Match Page (Server Component)
 * 
 * This page displays an active match between two players with real-time status updates.
 * Only the participants of the match can view this page.
 * 
 * Security: Checks if the current user is one of the match participants before displaying.
 */
export default async function LiveMatchPage({ params }: { params: { id: string } }) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch the match data
  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !match) {
    redirect('/dashboard');
  }

  // Security check: Only participants can view the match
  const isParticipant = match.player1_id === user.id || match.player2_id === user.id;
  if (!isParticipant) {
    redirect('/dashboard');
  }

  // Fetch player profiles
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .in('user_id', [match.player1_id, match.player2_id]);

  const player1 = players?.find((p: any) => p.user_id === match.player1_id);
  const player2 = players?.find((p: any) => p.user_id === match.player2_id);

  // Determine which player is the current user and which is the opponent
  const currentPlayer = match.player1_id === user.id ? player1 : player2;
  const opponent = match.player1_id === user.id ? player2 : player1;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-neutral border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-heading font-bold text-primary">Padel Connect - Live Match</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LiveMatchClient 
          matchId={params.id}
          match={match}
          currentPlayer={currentPlayer}
          opponent={opponent}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}

