export interface BackupMetadata {
  version: string;
  timestamp: string;
  os: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  settings?: any;
  exploration?: any;
  desktop?: any;
  room?: any;
}

class BackupServiceImpl {
  
  // Storage keys to include in backup
  private backupKeys = [
    'tardis-settings-storage',
    'tardis-exploration-storage',
    'tardis_wallpaper'
  ];

  async exportBackup(): Promise<void> {
    const backup: BackupData = {
      metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        os: 'TARDIS Den'
      },
      settings: this.getParsedItem('tardis-settings-storage'),
      exploration: this.getParsedItem('tardis-exploration-storage'),
      desktop: {
        wallpaper: localStorage.getItem('tardis_wallpaper')
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tardis_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  async importBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const backup: BackupData = JSON.parse(result);

          // Validation
          if (!backup.metadata || !backup.metadata.version) {
            throw new Error("Invalid archive format.");
          }

          // Restore settings
          if (backup.settings) {
            localStorage.setItem('tardis-settings-storage', JSON.stringify(backup.settings));
          }
          
          // Restore exploration
          if (backup.exploration) {
            localStorage.setItem('tardis-exploration-storage', JSON.stringify(backup.exploration));
          }

          // Restore desktop
          if (backup.desktop?.wallpaper) {
            localStorage.setItem('tardis_wallpaper', backup.desktop.wallpaper);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  getStorageStats(): { totalKB: number; itemsCount: number } {
    let totalBytes = 0;
    let itemsCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          totalBytes += item.length * 2; // rough estimate (UTF-16)
          itemsCount++;
        }
      }
    }
    
    return {
      totalKB: Math.round(totalBytes / 1024),
      itemsCount
    };
  }

  clearCache(): void {
    // We only clear non-critical items that are not in backupKeys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !this.backupKeys.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  private getParsedItem(key: string): any {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }
}

export const BackupService = new BackupServiceImpl();
