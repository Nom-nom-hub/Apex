import { ActionArgs, redirect } from '@apex/core';

export async function action({ request, params }: ActionArgs) {
  // Simulate creating a new item
  console.log('Creating new item');
  
  // Redirect back to the dashboard
  return redirect('/dashboard');
}