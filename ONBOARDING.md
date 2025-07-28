# Ammo Guys - Onboarding Flow

This document provides an overview of the onboarding flow implementation for The Ammo Guys application.

## Overview

The onboarding flow guides new users through a 7-step process to set up their account and preferences:

1. **Welcome** - Introduction to the service
2. **Account Information** - Collect user details
3. **Choose Calibers** - Select ammunition types
4. **Select Purpose** - Define usage scenarios
5. **Setup AutoStack** - Configure subscription
6. **Shipping Triggers** - Set delivery preferences
7. **Review & Submit** - Confirm and complete

## Technical Implementation

### Key Files

- `src/contexts/OnboardingContext.tsx` - Manages onboarding state and logic
- `src/lib/onboarding.ts` - Handles API calls and data persistence
- `src/app/onboarding/page.tsx` - Main onboarding page component
- `src/components/onboarding/` - Individual step components
- `supabase/migrations/` - Database schema and functions

### Database Schema

Key tables for onboarding:

- `profiles` - User profile information
- `user_stockpile` - User's ammo inventory
- `shipping_preferences` - User's shipping settings
- `onboarding_completions` - Tracks completed onboardings

## Testing the Onboarding Flow

### Prerequisites

1. Set up your `.env.local` file with Supabase credentials
2. Run database migrations
3. Start the development server

### Running Tests

1. Navigate to `/test/onboarding` in your browser
2. Follow the steps to complete the onboarding process
3. Verify data is saved correctly in the database

### Manual Testing

1. **Navigation**
   - Verify back/next buttons work as expected
   - Test direct URL access to steps (should redirect if invalid)

2. **Form Validation**
   - Test required fields
   - Validate email format
   - Verify password strength requirements

3. **Data Persistence**
   - Test page refresh during onboarding
   - Verify data is saved between sessions
   - Check database records after completion

4. **Error Handling**
   - Test with invalid inputs
   - Simulate network failures
   - Verify error messages are user-friendly

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify Supabase URL and anon key in `.env.local`
   - Check database migrations have run successfully

2. **Authentication**
   - Ensure email/password auth is enabled in Supabase
   - Check for CORS issues in the browser console

3. **State Management**
   - Clear local storage if state becomes corrupted
   - Check for TypeScript errors in the console

## Deployment

1. Run database migrations in production
2. Update environment variables in your hosting provider
3. Test the complete flow in the production environment

## Next Steps

- Add analytics to track drop-off points
- Implement A/B testing for different flows
- Add support for social login options
