
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/Navbar';
import { ArrowLeft, Save, Upload, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EditPost: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=400&fit=crop');

  const [postData, setPostData] = useState({
    description: 'Check out my new traditional Ghanaian kente dress! The colors are absolutely stunning...',
    tier: 'Basic Support',
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    status: 'Published' // This should match the actual status
  });

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'Published':
        return 'Update your published content';
      case 'Scheduled':
        return 'Update your scheduled content';
      case 'Draft':
        return 'Update your draft content';
      default:
        return 'Update your content';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);

    toast({
      title: "Media uploaded",
      description: `${file.name} has been selected successfully.`,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
      navigate('/creator/manage-content');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/creator/manage-content');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/creator/manage-content">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Manager
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Post</h1>
          <p className="text-muted-foreground">
            {getStatusDescription(postData.status)}
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Edit your post information and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Caption</Label>
                <Textarea
                  id="description"
                  value={postData.description}
                  onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Current Media Preview */}
              <div className="space-y-2">
                <Label>Current Media</Label>
                <div className="relative rounded-lg overflow-hidden bg-muted max-w-md">
                  <img
                    src={mediaPreview}
                    alt="Current media"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Upload New Media */}
              <div className="space-y-2">
                <Label>Upload Image or Video</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current media. Upload new file to replace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select value={postData.tier} onValueChange={(value) => setPostData(prev => ({ ...prev, tier: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Basic Support">Basic Support</SelectItem>
                      <SelectItem value="Premium Content">Premium Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Badge variant={postData.status === 'Published' ? 'default' : postData.status === 'Scheduled' ? 'secondary' : 'outline'}>
                      {postData.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {postData.status === 'Scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={postData.scheduledDate}
                      onChange={(e) => setPostData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={postData.scheduledTime}
                      onChange={(e) => setPostData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
