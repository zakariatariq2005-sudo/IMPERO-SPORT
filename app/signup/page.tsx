'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

/**
 * Signup Page Component
 * 
 * This page allows new users to create an account with email, password,
 * name, skill level, and location. After signup, a player profile is created
 * and the user is automatically logged in and redirected to the dashboard.
 */
export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    skillLevel: 'Beginner',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create the user account with email and password
      const emailRedirectTo = typeof window !== 'undefined' 
        ? `${window.location.origin}/dashboard`
        : undefined;
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        ...(emailRedirectTo && {
          options: {
            emailRedirectTo,
          },
        }),
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create account');
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      // If session exists, user is automatically logged in (email confirmation disabled)
      // If no session, email confirmation is required
      if (authData.session) {
        // User is automatically logged in (email confirmation disabled)
        // Create the player profile in our database
        const { error: profileError } = await supabase
          .from('players')
          .insert({
            user_id: authData.user.id,
            name: formData.name,
            skill_level: formData.skillLevel,
            location: formData.location,
            is_online: true,
          });

        if (profileError) {
          setError('Account created but failed to create profile. Please try logging in.');
          setLoading(false);
          return;
        }

        // Redirect to dashboard on success
        router.push('/dashboard');
        router.refresh();
      } else {
        // Email confirmation is required
        // Create player profile using a database function or wait for confirmation
        // For now, we'll create it anyway - it will be created when they confirm email
        const { error: profileError } = await supabase
          .from('players')
          .insert({
            user_id: authData.user.id,
            name: formData.name,
            skill_level: formData.skillLevel,
            location: formData.location,
            is_online: false, // Set to false until they confirm and log in
          });

        if (profileError) {
          // If profile creation fails, still show success message for signup
          // The profile can be created on first login
          console.error('Profile creation error:', profileError);
        }

        setError(null);
        setLoading(false);
        alert('Account created! Please check your email to confirm your account, then log in.');
        router.push('/login');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-neutral rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2 text-center">
            Padel Connect
          </h1>
          <p className="text-gray-600 text-center mb-8">Create your account to start playing</p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="skillLevel" className="block text-sm font-medium text-dark mb-2">
                Skill Level
              </label>
              <select
                id="skillLevel"
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-dark mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="City, Country"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-neutral font-medium py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


