import { describe, it, expect } from 'vitest';
import { json, redirect } from '../src/route-types';

describe('Route Types', () => {
  it('should create JSON responses', () => {
    const data = { message: 'Hello, World!' };
    const response = json(data);
    
    expect(response).toEqual({
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  });
  
  it('should create JSON responses with custom status', () => {
    const data = { error: 'Not Found' };
    const response = json(data, { status: 404 });
    
    expect(response).toEqual({
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  });
  
  it('should create redirect responses', () => {
    const response = redirect('/dashboard');
    
    expect(response).toEqual({
      status: 302,
      headers: {
        Location: '/dashboard'
      },
      body: ''
    });
  });
  
  it('should create redirect responses with custom status', () => {
    const response = redirect('/dashboard', { status: 301 });
    
    expect(response).toEqual({
      status: 301,
      headers: {
        Location: '/dashboard'
      },
      body: ''
    });
  });
});