import { AlertTriangle, Database, Download, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { BackupService } from '../services/BackupService';

export const DataArchiveApp: React.FC = () => {
  const [stats, setStats] = useState({ totalKB: 0, itemsCount: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStats(BackupService.getStorageStats());
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await BackupService.exportBackup();
    } catch (e) {
      console.error(e);
      alert('Failed to export backup.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Warning: Restoring this archive will overwrite your current settings and exploration progress. Do you wish to continue?')) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsImporting(true);
    setImportStatus('Validating archive...');
    
    try {
      await BackupService.importBackup(file);
      setImportStatus('Restore successful! Restarting system...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setImportStatus(`Error: ${err.message || 'Corrupted archive.'}`);
      setIsImporting(false);
    }
  };

  const handleClearCache = () => {
    if (confirm('Clear temporary cache? This will not delete your settings or achievements.')) {
      BackupService.clearCache();
      setStats(BackupService.getStorageStats());
      alert('Cache cleared successfully.');
    }
  };

  return (
    <div className="flex h-full bg-[#fbe4d8] text-[#190019] font-['Space_Mono',monospace]">
      
      {/* Sidebar */}
      <div className="w-1/3 max-w-[210px] border-r border-[#854f6c] p-4 bg-[#2b124c] text-[#fbe4d8] flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#854f6c]/50">
            <Database className="w-5 h-5 text-[#dfb6b2]" />
            <h2 className="text-base font-bold tracking-tight text-[#fbe4d8]">Data Archive</h2>
          </div>
          
          <div className="space-y-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#dfb6b2]/60">Storage Status</div>
            <div className="bg-[#190019] p-4 rounded-xl border border-[#854f6c] shadow-[2px_2px_0px_#854f6c]">
              <p className="text-2xl font-bold text-[#fbe4d8] tabular-nums">{stats.totalKB} <span className="text-xs text-[#dfb6b2]">KB</span></p>
              <p className="text-[10px] font-bold text-[#dfb6b2]/70 mt-1 uppercase tracking-wider">{stats.itemsCount} stored records</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-[#854f6c]/40 text-[10px] uppercase tracking-widest text-[#dfb6b2]/60">
          TARDIS Den OS v1.2.0
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#fbe4d8]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#2b124c] border-b-2 border-[#854f6c] pb-3">
            Observatory Archives
          </h1>
          <p className="text-xs text-[#190019]/80 font-bold bg-[#dfb6b2] p-3 border border-[#190019]">
            Backup or restore your personal TARDIS settings, logbook, and desktop configurations.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Backup */}
            <div className="p-5 border-2 border-[#190019] bg-white shadow-[4px_4px_0px_#190019] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2b124c] mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#854f6c]" /> 
                  <span>Create Backup</span>
                </h3>
                <p className="text-xs text-[#190019]/70 mb-4 leading-relaxed">
                  Export a backup JSON file containing all settings, wallpapers, and log achievements.
                </p>
              </div>
              <button 
                onClick={handleExport}
                disabled={isExporting || isImporting}
                className="w-full bg-[#190019] text-[#fbe4d8] py-2.5 px-3 border-2 border-[#190019] font-bold text-xs uppercase tracking-wider hover:bg-[#2b124c] transition-all shadow-[2px_2px_0px_#854f6c] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                {isExporting ? 'Packaging...' : 'Export Archive'}
              </button>
            </div>

            {/* Restore */}
            <div className="p-5 border-2 border-[#190019] bg-white shadow-[4px_4px_0px_#190019] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2b124c] mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#854f6c]" /> 
                  <span>Restore Archive</span>
                </h3>
                <p className="text-xs text-[#190019]/70 mb-4 leading-relaxed">
                  Import an existing TARDIS Den backup file to restore system configurations.
                </p>
              </div>
              <div>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExporting || isImporting}
                  className="w-full bg-[#dfb6b2] text-[#190019] py-2.5 px-3 border-2 border-[#190019] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[2px_2px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  {isImporting ? 'Restoring...' : 'Upload Archive'}
                </button>
                {importStatus && (
                  <p className={`mt-2 text-[11px] font-bold text-center ${importStatus.includes('Error') ? 'text-red-700' : 'text-green-800'}`}>
                    {importStatus}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#854f6c]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#854f6c] mb-3">System Maintenance</h2>
            <div className="p-4 border-2 border-[#190019] bg-white shadow-[3px_3px_0px_#190019] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#2b124c] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Clear Storage Cache</span>
                </h3>
                <p className="text-[11px] text-[#190019]/70 mt-1">Frees local cache memory without affecting persistent journal notes.</p>
              </div>
              <button 
                onClick={handleClearCache}
                className="bg-[#854f6c] text-[#fbe4d8] hover:bg-[#190019] px-3 py-2 font-bold text-xs uppercase tracking-wider border border-[#190019] shadow-[2px_2px_0px_#190019] transition-all"
              >
                Clear Cache
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
