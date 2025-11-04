/**
 * Activities Renderer Module
 * Handles rendering of group activities
 */

class ActivitiesRenderer {
  constructor() {
    this.currentFilter = 'all';
    this.activities = [];
  }

  async init() {
    try {
      this.activities = await window.dataLoader.loadActivities();
      this.setupEventListeners();
      this.renderActivities();
    } catch (error) {
      console.error('Error initializing activities:', error);
    }
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.activities-filter .filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');

        this.currentFilter = e.target.dataset.filter;
        this.renderActivities();
      });
    });
  }

  renderActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;

    const filteredActivities = this.filterActivities(this.activities, this.currentFilter);

    if (filteredActivities.length === 0) {
      container.innerHTML = '<p class="no-activities" data-i18n="activities.noActivities">No activities found.</p>';
      return;
    }

    container.innerHTML = filteredActivities.map(activity => this.renderActivityCard(activity)).join('');
  }

  filterActivities(activities, filter) {
    if (filter === 'all') return activities;
    return activities.filter(activity => activity.category === filter);
  }

  renderActivityCard(activity) {
    const isEn = document.documentElement.lang === 'en';
    const title = isEn ? activity.title_en : activity.title;
    const description = isEn ? activity.description_en : activity.description;
    const location = isEn ? activity.location_en : activity.location;
    const participants = isEn ? activity.participants_en.join(', ') : activity.participants.join('、');

    // Format date
    const date = new Date(activity.date);
    const formattedDate = date.toLocaleDateString(isEn ? 'en-US' : 'zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get category label
    const categoryLabel = this.getCategoryLabel(activity.category, isEn);

    // Generate image gallery HTML
    const imagesHtml = activity.images && activity.images.length > 0
      ? `
        <div class="activity-images">
          ${activity.images.map((img, index) => `
            <img src="${img}" alt="${title} - Image ${index + 1}"
                 class="activity-image"
                 onclick="window.open('${img}', '_blank')"
                 loading="lazy">
          `).join('')}
        </div>
      `
      : '';

    return `
      <div class="activity-card" data-category="${activity.category}">
        <div class="activity-header">
          <div class="activity-meta">
            <span class="activity-date">${formattedDate}</span>
            <span class="activity-category">${categoryLabel}</span>
          </div>
          <h3 class="activity-title">${title}</h3>
        </div>

        <div class="activity-content">
          <div class="activity-info">
            <div class="activity-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>${location}</span>
            </div>
            <div class="activity-detail">
              <i class="fas fa-users"></i>
              <span>${participants}</span>
            </div>
          </div>

          <p class="activity-description">${description}</p>

          ${imagesHtml}
        </div>
      </div>
    `;
  }

  getCategoryLabel(category, isEn) {
    const labels = {
      'team-building': isEn ? 'Team Building' : '团建活动',
      'academic': isEn ? 'Academic' : '学术活动',
      'celebration': isEn ? 'Celebration' : '庆祝活动'
    };
    return labels[category] || category;
  }
}

// Create singleton instance
window.activitiesRenderer = new ActivitiesRenderer();