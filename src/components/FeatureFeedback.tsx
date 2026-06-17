import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, X, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../utils/api';

interface FeatureFeedbackProps {
  featureType: string; // e.g., 'chat_response', 'chapter_review'
  onClose?: () => void;
}

const FEEDBACK_COOLDOWN_DAYS = 14;

export const FeatureFeedback: React.FC<FeatureFeedbackProps> = ({ featureType, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check cooldown
    const lastFeedbackDate = localStorage.getItem(`prof-ada-feedback-${featureType}`);
    if (lastFeedbackDate) {
      const daysSince = (Date.now() - parseInt(lastFeedbackDate, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < FEEDBACK_COOLDOWN_DAYS) {
        return; // Still in cooldown
      }
    }
    
    // Slight delay to not interrupt the immediate AI response read
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [featureType]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const submitFeedback = async (rating: string, reason?: string, customMessage?: string) => {
    setSubmitting(true);
    try {
      await api.post('/feedback', {
        featureType,
        rating,
        reason: reason || null,
        message: customMessage || null,
        device: navigator.userAgent,
        theme: localStorage.getItem('prof-ada-theme') || 'system',
        version: '0.1.0'
      });
      
      // Save cooldown
      localStorage.setItem(`prof-ada-feedback-${featureType}`, Date.now().toString());
      
      setShowToast(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbsUp = () => {
    submitFeedback('thumbs_up');
  };

  const handleThumbsDown = () => {
    setExpanded(true);
  };

  const handleSubmitNegative = () => {
    submitFeedback('thumbs_down', selectedReason, message);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4 w-[320px] sm:w-[350px] relative overflow-hidden">
        
        {/* Toast Overlay */}
        {showToast && (
          <div className="absolute inset-0 bg-green-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <p className="font-medium">Feedback saved</p>
          </div>
        )}

        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/50 hover:text-white/90 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!expanded ? (
          <div>
            <h4 className="text-sm font-medium text-white/90 mb-3 pr-6">
              Did Prof. Ada help you?
            </h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleThumbsUp}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-sm text-white/80 transition-all active:scale-95"
              >
                {submitting && !expanded ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                Helpful
              </button>
              <button 
                onClick={handleThumbsDown}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-sm text-white/80 transition-all active:scale-95"
              >
                <ThumbsDown className="w-4 h-4" />
                Needs Improvement
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-sm font-medium text-white/90 mb-3">What happened?</h4>
            
            <div className="space-y-2 mb-3">
              {['Too generic', 'Incorrect guidance', 'Slow response', 'Hard to understand', 'Other'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                  <input 
                    type="radio" 
                    name="feedback-reason" 
                    value={opt}
                    checked={selectedReason === opt}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-orange-500"
                  />
                  {opt}
                </label>
              ))}
            </div>

            <textarea
              placeholder="Additional details (optional)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-orange-500/50 mb-3"
              rows={2}
            />

            <button
              onClick={handleSubmitNegative}
              disabled={!selectedReason || submitting}
              className="w-full bg-orange-500/90 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-all flex justify-center items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
