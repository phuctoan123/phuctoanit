import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react'
import { Button } from '../components/admin/ui/Button'
import { Badge } from '../components/admin/ui/Badge'
import { Pagination } from '../components/admin/ui/Pagination'
import { ConfirmDialog } from '../components/admin/ui/Modal'
import { EmptyState, TableSkeleton } from '../components/admin/ui/EmptyState'
import { getPosts, deletePost } from '../lib/cms'
import type { Post } from '../types/admin'
import { useToast } from '../hooks/useToast'

const PAGE_SIZE = 10

const CATEGORY_MAP: Record<string, { label: string; badgeVariant: 'default' | 'info' | 'warning' | 'success' | 'muted' }> = {
  'tu-van-giai-phap': { label: 'Tư vấn & Tối ưu chi phí', badgeVariant: 'default' },
  'ha-tang-bao-mat': { label: 'Hạ tầng & Bảo mật', badgeVariant: 'info' },
  'case-study': { label: 'Case Study', badgeVariant: 'warning' },
  'chuyen-doi-so': { label: 'Chuyển đổi số', badgeVariant: 'success' },
}

const SERVICE_MAP: Record<string, string> = {
  'email-server': 'Email Server Doanh Nghiệp',
  'web-development': 'Thiết Kế Website',
  'consulting-demo': 'Tư vấn giải pháp & Dựng POC',
  'hosting-domain': 'Cloud Hosting & Tên Miền',
  'custom-software': 'Phát triển phần mềm riêng',
}

export function PostsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [page, setPage] = useState(1)

  // Delete modal state
  const [deletingPost, setDeletingPost] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getPosts()
    if (error) {
      showToast('Lỗi khi tải danh sách bài viết: ' + error, 'error')
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Filtered list
  const filtered = useMemo(() => {
    return posts.filter((post) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchTitle = (post.title_vi || '').toLowerCase().includes(q)
        const matchSlug = (post.slug || '').toLowerCase().includes(q)
        const matchExcerpt = (post.excerpt_vi || '').toLowerCase().includes(q)
        if (!matchTitle && !matchSlug && !matchExcerpt) return false
      }
      // Status
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false
      }
      // Category
      if (categoryFilter !== 'all' && post.category !== categoryFilter) {
        return false
      }
      return true
    })
  }, [posts, search, statusFilter, categoryFilter])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = search || statusFilter !== 'all' || categoryFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setPage(1)
  }

  // Handle Delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingPost) return
    setDeleting(true)
    const { success, error } = await deletePost(deletingPost.id)
    setDeleting(false)

    if (!success) {
      showToast('Lỗi khi xóa bài viết: ' + (error || ''), 'error')
      return
    }

    showToast('Đã xóa bài viết thành công!', 'success')
    setDeletingPost(null)
    fetchPosts()
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6A6A6A]">
        <Link to="/admin" className="hover:text-[#FA520F] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#1F1F1F] font-medium">Bài viết &amp; Tin tức</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Bài viết &amp; Tin tức</h1>
          <p className="text-sm text-[#6A6A6A] mt-0.5">
            Quản lý nội dung góc tư vấn &amp; giải pháp hiển thị trên website
            {!loading && (
              <span className="ml-1.5 font-semibold text-[#1F1F1F]">
                · {posts.length} bài viết
              </span>
            )}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/admin/posts/new')}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tạo bài viết mới
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#EDEDED] p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Tìm theo tiêu đề, đường dẫn (slug)..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#EDEDED] rounded-lg outline-none focus:border-[#FA520F] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A8] hover:text-[#1F1F1F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#6A6A6A] whitespace-nowrap hidden sm:inline">Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setPage(1)
              }}
              className="w-full sm:w-auto text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F] bg-white text-[#4A4A4A]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#6A6A6A] whitespace-nowrap hidden sm:inline">Chuyên mục:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-auto text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:border-[#FA520F] bg-white text-[#4A4A4A]"
            >
              <option value="all">Tất cả chuyên mục</option>
              <option value="tu-van-giai-phap">Tư vấn &amp; Tối ưu chi phí</option>
              <option value="ha-tang-bao-mat">Hạ tầng &amp; Bảo mật</option>
              <option value="case-study">Case Study</option>
              <option value="chuyen-doi-so">Chuyển đổi số</option>
            </select>
          </div>

          {/* Reset button */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-[#6A6A6A] hover:text-[#FA520F]"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6 text-[#A8A8A8]" />}
            title={hasFilters ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
            description={
              hasFilters
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc đang chọn.'
                : 'Bắt đầu tạo bài viết đầu tiên để xây dựng góc tư vấn giải pháp uy tín cho khách hàng B2B.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigate('/admin/posts/new')}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Tạo bài viết mới
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#EDEDED] bg-[#FAFAFA] text-xs font-semibold text-[#6A6A6A]">
                  <th className="py-3 px-4 min-w-[280px]">BÀI VIẾT</th>
                  <th className="py-3 px-4 min-w-[150px]">CHUYÊN MỤC</th>
                  <th className="py-3 px-4 min-w-[170px]">DỊCH VỤ LIÊN KẾT</th>
                  <th className="py-3 px-4 min-w-[130px]">TRẠNG THÁI</th>
                  <th className="py-3 px-4 min-w-[130px]">NGÀY ĐĂNG</th>
                  <th className="py-3 px-4 text-right min-w-[160px]">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {paginated.map((post) => {
                  const cat = CATEGORY_MAP[post.category] || { label: post.category, badgeVariant: 'muted' }
                  const serviceName = SERVICE_MAP[post.related_service] || post.related_service

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-[#FAFAFA] transition-colors group"
                    >
                      {/* Column 1: Article info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-11 rounded-lg overflow-hidden bg-[#EDEDED] flex-shrink-0 border border-[#E0E0E0] shadow-2xs">
                            {post.thumbnail ? (
                              <img
                                src={post.thumbnail}
                                alt={post.title_vi}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A8A8A8]">
                                Không ảnh
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-[#1F1F1F] line-clamp-1 hover:text-[#FA520F] transition-colors">
                                <Link to={`/admin/posts/${post.id}/edit`}>
                                  {post.title_vi}
                                </Link>
                              </span>
                              {(post.is_featured || post.featured) && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                  Nổi bật
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#8A8A8A] font-mono truncate mt-0.5">
                              /blog/{post.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant={cat.badgeVariant}>
                          {cat.label}
                        </Badge>
                      </td>

                      {/* Column 3: Related Service */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#4A4A4A] bg-[#F5F5F5] px-2 py-1 rounded-md font-medium">
                          {serviceName}
                        </span>
                      </td>

                      {/* Column 4: Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {post.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã xuất bản ✓
                          </span>
                        ) : post.status === 'draft' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Bản nháp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            <Archive className="w-3.5 h-3.5 text-gray-500" />
                            Lưu trữ
                          </span>
                        )}
                      </td>

                      {/* Column 5: Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#6A6A6A]">
                        {formatDate(post.published_at || post.created_at || '')}
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/blog-detail.html?slug=${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#6A6A6A] hover:text-[#FA520F] hover:bg-[#FFF0E8] rounded-lg transition-colors"
                            title="Xem trên website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Link
                            to={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 text-[#6A6A6A] hover:text-[#FA520F] hover:bg-[#FFF0E8] rounded-lg transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeletingPost(post)}
                            className="p-1.5 text-[#6A6A6A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="p-4 border-t border-[#EDEDED]">
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa bài viết?"
        description={`Bạn có chắc chắn muốn xóa bài viết "${deletingPost?.title_vi}"? Hành động này sẽ xóa vĩnh viễn bài viết khỏi cơ sở dữ liệu và website public.`}
        confirmLabel="Xác nhận xóa"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
