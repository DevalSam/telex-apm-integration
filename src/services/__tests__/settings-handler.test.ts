// src/services/platform-handler.ts
import { APMSettings } from '../types.js';
import logger from '../utils/logger.js';

export class PlatformHandler {
 private readonly validPlatforms = ['flutter', 'react-native', 'ios', 'android', 'web'];

 public parsePlatforms(input: string | string[] | undefined): string[] {
   try {
     // Handle undefined case
     if (!input) {
       return [];
     }

     // Handle string case (comma-separated)
     if (typeof input === 'string') {
       return input
         .split(',')
         .map(platform => platform.trim())
         .filter(platform => platform.length > 0);
     }

     // Handle array case
     if (Array.isArray(input)) {
       return input.filter(platform => 
         typeof platform === 'string' && platform.trim().length > 0
       );
     }

     return [];
   } catch (error) {
     logger.error('Failed to parse platforms', 
       error instanceof Error ? error.message : 'Unknown error',
       {
         method: 'parsePlatforms',
         input: String(input)
       }
     );
     return [];
   }
 }

 public validatePlatforms(platforms: string[]): boolean {
   return platforms.every(platform => 
     this.validPlatforms.includes(platform.toLowerCase())
   );
 }

 public formatPlatformSettings(partialSettings: Partial<APMSettings>): Partial<APMSettings> {
   const platforms = this.parsePlatforms(partialSettings.monitored_platforms);
   
   if (!this.validatePlatforms(platforms)) {
     logger.error('Invalid platform specified', 
       {
         method: 'formatPlatformSettings',
         platforms
       }
     );
     throw new Error('Invalid platform specified');
   }

   return {
     ...partialSettings,
     monitored_platforms: platforms
   };
 }
}

// Example usage:
// const handler = new PlatformHandler();
// const platforms = handler.parsePlatforms('flutter,react-native');
// console.log(platforms); // ['flutter', 'react-native']