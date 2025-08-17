import { LoaderArgs, json } from '@apex/core';

export async function loader({ request, params }: LoaderArgs) {
  // Simulate fetching user and items data
  const user = {
    name: 'John Doe'
  };
  
  const items = [
    'Item 1',
    'Item 2',
    'Item 3'
  ];
  
  return json({ user, items });
}