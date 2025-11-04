/**
 * Data Loader Module
 * Handles loading and caching of configuration data
 */

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async loadJSON(filePath) {
    const cacheKey = filePath;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.status}`);
      }
      const data = await response.json();

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  async loadLabInfo() {
    return this.loadJSON('config/lab-info.json');
  }

  async loadResearchAreas() {
    return this.loadJSON('config/research-areas.json');
  }

  async loadMembers() {
    return this.loadJSON('config/members.json');
  }

  async loadPublications() {
    return this.loadJSON('config/publications.json');
  }

  async loadThemeConfig() {
    return this.loadJSON('config/theme-config.json');
  }

  async loadI18n() {
    return this.loadJSON('config/i18n.json');
  }

  async loadActivities() {
    return this.loadJSON('config/activities.json');
  }

  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
window.dataLoader = new DataLoader();