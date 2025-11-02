'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/layout/navbar'
import {
  Calendar, Clock, User, ArrowRight, Search, Filter,
  TrendingUp, Bookmark, Share2, Eye, Heart, MessageCircle
} from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "The Future of Remote Work: Trends and Opportunities for 2024",
    excerpt: "Explore how remote work is evolving and what it means for career opportunities in the digital age.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Career Trends",
    image: "/api/placeholder/400/250",
    views: 2543,
    likes: 89,
    comments: 23,
    featured: true
  },
  {
    id: 2,
    title: "AI Skills That Will Make You Irreplaceable in 2024",
    excerpt: "Discover the essential AI skills that employers are looking for and how to develop them.",
    author: "Dr. Michael Chen",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Skill Development",
    image: "/api/placeholder/400/250",
    views: 1890,
    likes: 67,
    comments: 15
  },
  {
    id: 3,
    title: "Navigating Career Transitions: A Complete Guide",
    excerpt: "Learn strategies for successfully transitioning to a new career field or industry.",
    author: "Emily Rodriguez",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Career Change",
    image: "/api/placeholder/400/250",
    views: 3421,
    likes: 156,
    comments: 34
  },
  {
    id: 4,
    title: "Building Your Personal Brand on LinkedIn",
    excerpt: "Essential tips for creating a compelling LinkedIn profile that attracts employers.",
    author: "Alex Kim",
    date: "2024-01-08",
    readTime: "5 min read",
    category: "Personal Branding",
    image: "/api/placeholder/400/250",
    views: 1567,
    likes: 78,
    comments: 19
  },
  {
    id: 5,
    title: "The Complete Guide to Salary Negotiation",
    excerpt: "Master the art of salary negotiation with proven strategies and real examples.",
    author: "Marcus Thompson",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Career Advancement",
    image: "/api/placeholder/400/250",
    views: 4123,
    likes: 203,
    comments: 87
  },
  {
    id: 6,
    title: "Top Programming Languages to Learn in 2024",
    excerpt: "Stay ahead of the curve with these in-demand programming languages for developers.",
    author: "Lisa Chang",
    date: "2024-01-03",
    readTime: "7 min read",
    category: "Technology",
    image: "/api/placeholder/400/250",
    views: 2890,
    likes: 134,
    comments: 45
  }
]

const categories = ["All", "Career Trends", "Skill Development", "Career Change", "Personal Branding", "Career Advancement", "Technology"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([])

  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const otherPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Career <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Expert advice, industry trends, and practical tips to accelerate your career growth. 
              Stay informed with the latest insights from career professionals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-12 border-0 text-gray-900 text-lg py-4 focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h3 className="text-3xl font-bold mb-4">{featuredPost.title}</h3>
                    <p className="text-blue-100 text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center space-x-6 text-blue-200 text-sm mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-white">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="aspect-video bg-white/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="hover:scale-105 transition-transform"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.filter(post => !post.featured).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 h-full">
                    <div className="aspect-video bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Bookmark 
                            className={`w-4 h-4 ${bookmarkedPosts.includes(post.id) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
                          />
                        </button>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Posts */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Popular Posts
              </h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <span className="text-2xl font-bold text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest career insights and tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </Card>

            {/* Social Share */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  LinkedIn
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Twitter
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}