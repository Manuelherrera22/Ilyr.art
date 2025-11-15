import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irfjdnwxbzlcpbxhjuqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZmpkbnd4YnpsY3BieGhqdXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzQzNDIsImV4cCI6MjA2NjYxMDM0Mn0.39TnJQhdJNMZ5ysWWaX-WWRN4owfwXpl1NJYvxU2ZKQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);