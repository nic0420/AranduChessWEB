import React, { useState } from 'react';
import { VIDEOS_DATA } from '../data/videosData';
import { Video, Play, BookOpen, Award, CheckCircle } from 'lucide-react';

/**
 * VideoZone - Video Masterclass Library & Interactive Walkthroughs
 */
export default function VideoZone() {
  const [selectedVideo, setSelectedVideo] = useState(VIDEOS_DATA[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Video color="var(--accent-green)" size={24} /> Zona de Masterclass en Video
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Aprende conceptos estratégicos de la mano de Grandes Maestros y Titulados FIDE.
        </p>
      </div>

      {/* Main Layout: Video Player + Playlist */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left Column: Embedded Video & Concept Takeaways */}
        <div style={{ flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Responsive Video Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              backgroundColor: '#000'
            }}
          >
            <iframe
              src={selectedVideo.videoUrl}
              title={selectedVideo.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Summary & Key Concepts Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{selectedVideo.title}</h3>
              <span className="btn-gold" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                🎯 {selectedVideo.eloTarget}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Impartido por: <strong style={{ color: 'var(--accent-green)' }}>{selectedVideo.instructor}</strong>
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{selectedVideo.summary}</p>

            <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />

            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>💡 Puntos Clave de la Clase:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedVideo.takeaways.map((point, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={16} color="var(--accent-green)" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Masterclass Playlist */}
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px' }}>🎬 Colección de Masterclasses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {VIDEOS_DATA.map(vid => {
                const isSelected = selectedVideo.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{vid.thumbnail}</span>
                    <div>
                      <h4 style={{ fontSize: '0.88rem', color: isSelected ? 'var(--accent-green)' : '#fff', lineHeight: 1.2 }}>
                        {vid.title}
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        ⏱️ {vid.duration} • {vid.instructor}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
