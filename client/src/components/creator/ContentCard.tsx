
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Trash2, 
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  Timer,
  Image,
  Video,
  FileText
} from 'lucide-react';

interface ContentCardProps {
  id: string;
  caption: string;
  type: 'Image' | 'Video' | 'Text';
  tier: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  views: number;
  likes: number;
  comments: number;
  mediaPreview?: string;
  category: string;
  scheduledFor?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onViewContent?: (item: ContentCardProps) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  caption,
  type,
  tier,
  status,
  date,
  views,
  likes,
  comments,
  mediaPreview,
  category,
  scheduledFor,
  onEdit,
  onDelete,
  onPublish,
  onViewContent
}) => {
  const [expandedCaption, setExpandedCaption] = useState(false);

  const truncateText = (text: string) => {
    // Only truncate if text is likely to exceed one line (roughly 60-80 characters)
    if (text.length <= 60) {
      return { truncated: text, needsExpansion: false };
    }
    
    // Find a good break point around 50-60 characters
    const words = text.split(' ');
    let truncated = '';
    
    for (let i = 0; i < words.length; i++) {
      const testString = truncated + (truncated ? ' ' : '') + words[i];
      if (testString.length > 50) {
        if (truncated === '') {
          // If even the first word is too long, take it anyway
          truncated = words[0];
        }
        break;
      }
      truncated = testString;
    }
    
    return {
      truncated,
      needsExpansion: truncated !== text
    };
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'Image':
        return <Image className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Scheduled':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getMediaOverlayIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'image':
        return <Image className="w-4 h-4 text-white" />;
      case 'video':
        return <Video className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-200">
      <CardContent className="p-3">
        {/* Content Preview - Profile style layout */}
        <div className="space-y-3">
          {/* Header - Tier badge and date at top of card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                {tier}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>

          {/* Caption */}
          {(() => {
            const { truncated, needsExpansion } = truncateText(caption);
            return (
              <div className="font-medium text-foreground text-sm leading-tight">
                {expandedCaption ? caption : (
                  <>
                    {truncated}
                    {needsExpansion && !expandedCaption && (
                      <>
                        {'... '}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCaption(true);
                          }}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          read more
                        </button>
                      </>
                    )}
                  </>
                )}
                {expandedCaption && needsExpansion && (
                  <>
                    {' '}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCaption(false);
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      read less
                    </button>
                  </>
                )}
              </div>
            );
          })()}



          {/* Media Preview - Square aspect ratio like profile */}
          <div className="relative">
            <div 
              className="w-full aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onViewContent && onViewContent({
                  id,
                  caption,
                  type,
                  tier,
                  status,
                  date,
                  views,
                  likes,
                  comments,
                  mediaPreview,
                  category,
                  scheduledFor
                });
              }}
            >
              {mediaPreview ? (
                <div className="w-full h-full">
                  {type === 'Video' ? (
                    <video 
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={mediaPreview}
                      alt={caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                        target.className = "w-full h-full object-cover opacity-50";
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    {getTypeIcon()}
                    <p className="mt-2 text-xs">{type} Content</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom row - Stats/Release Info and Actions combined */}
          <div className="flex items-center justify-between pt-1">
            {/* Stats or Release Info */}
            {status === 'Published' ? (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{comments}</span>
                </div>
              </div>
            ) : status === 'Scheduled' && scheduledFor ? (
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Timer className="w-3 h-3" />
                <span>
                  {(() => {
                    const releaseDate = new Date(scheduledFor);
                    const now = new Date();
                    const isToday = releaseDate.toDateString() === now.toDateString();
                    const isTomorrow = releaseDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
                    
                    if (isToday) {
                      return `Today ${releaseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                    } else if (isTomorrow) {
                      return `Tomorrow ${releaseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                    } else {
                      return releaseDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                    }
                  })()}
                </span>
              </div>
            ) : (
              <div></div>
            )}

            {/* Action Buttons - compact inline */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className="h-7 px-2 text-xs"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
