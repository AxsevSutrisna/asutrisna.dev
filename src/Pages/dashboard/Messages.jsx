import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabase'
import { useToast } from '../../hooks/useToast'
import ToastStack from '../../components/ToastStack'
import {
    Trash2,
    Mail,
    MailOpen,
    MessageSquare,
    Clock,
    CheckCircle2,
    User,
    Search,
    X,
    ChevronDown,
    ArrowDownUp
} from 'lucide-react'

/* ── Helpers ── */
const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/* ── Premium Accordion Message Card ── */
const MessageCard = ({ item, onDelete, onToggleRead, isExpanded, onToggleExpand }) => {
    return (
        <div
            className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${
                item.is_read ? 'bg-white/[0.02] border-white/5' : 'bg-white/5 border-white/10'
            }`}
        >
            {/* Header Row (Always Visible) */}
            <div 
                onClick={onToggleExpand}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors gap-4"
            >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Read Status Dot */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.is_read ? 'bg-transparent' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'}`} />
                    
                    {/* Sender Info & Subject */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0 flex-1">
                        <span className={`text-sm truncate w-full sm:w-48 shrink-0 ${item.is_read ? 'text-gray-400 font-medium' : 'text-white font-bold'}`}>
                            {item.name}
                        </span>
                        <span className={`text-sm truncate min-w-0 flex-1 ${item.is_read ? 'text-gray-500' : 'text-gray-200 font-medium'}`}>
                            {item.subject || 'No Subject'}
                        </span>
                    </div>
                </div>

                {/* Date & Expand Icon */}
                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">
                        {formatDate(item.created_at)}
                    </span>
                    <div className="text-gray-500 group-hover:text-white transition-colors">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {/* Expanded Body */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-4 border-t border-white/5 bg-black/20">
                    <div className="flex flex-col gap-4">
                        {/* Mobile Date */}
                        <div className="text-xs text-gray-500 sm:hidden">
                            {formatDate(item.created_at)}
                        </div>
                        
                        {/* Sender Detail & Actions */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400 truncate hover:text-indigo-300 transition-colors"><a href={`mailto:${item.email}`}>{item.email}</a></p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleRead(item); }}
                                    title={item.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                    className={`p-2 rounded-lg border text-xs transition-all ${
                                        item.is_read
                                            ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'
                                    }`}
                                >
                                    {item.is_read ? <Mail className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    title="Delete"
                                    className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mt-2 p-5 bg-white/5 rounded-xl border border-white/5">
                            {item.message}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Skeleton ── */
const SkeletonCard = () => (
    <div className="rounded-xl border border-white/6 overflow-hidden animate-pulse">
        <div className="w-full flex items-center justify-between p-4 bg-white/[0.02]">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-full">
                    <div className="h-4 bg-white/10 rounded w-1/3 sm:w-48 shrink-0" />
                    <div className="h-4 bg-white/10 rounded w-1/2 flex-1" />
                </div>
            </div>
            <div className="w-24 h-4 bg-white/10 rounded shrink-0 hidden sm:block" />
        </div>
    </div>
)

/* ── Main Page ── */
export default function Messages() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'unread', 'read'
    const [sortOrder, setSortOrder] = useState('newest') // 'newest', 'oldest'
    const [expandedId, setExpandedId] = useState(null)
    const { toasts, pushToast, removeToast } = useToast()

    const fetchItems = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
        if (error) console.error('Error fetching messages:', error)
        setItems(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const deleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (error) {
            pushToast('error', error.message || 'Failed to delete message')
            return
        }
        pushToast('success', 'Message deleted successfully!')
        fetchItems()
    }

    const toggleReadStatus = async (item) => {
        const { error } = await supabase.from('messages').update({ is_read: !item.is_read }).eq('id', item.id)
        if (error) {
            pushToast('error', error.message || 'Failed to update status')
            return
        }
        pushToast('success', item.is_read ? 'Marked as unread' : 'Marked as read')
        fetchItems()
    }

    const unreadCount = items.filter((i) => !i.is_read).length
    const readCount = items.length - unreadCount

    const filteredItems = items.filter(item => {
        if (filterStatus === 'unread' && item.is_read) return false;
        if (filterStatus === 'read' && !item.is_read) return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchName = item.name?.toLowerCase().includes(query);
            const matchEmail = item.email?.toLowerCase().includes(query);
            const matchSubject = item.subject?.toLowerCase().includes(query);
            const matchMessage = item.message?.toLowerCase().includes(query);
            if (!matchName && !matchEmail && !matchSubject && !matchMessage) return false;
        }

        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="absolute -inset-1 rounded-xl blur-md opacity-60" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))' }} />
                        <div className="relative w-10 h-10 rounded-xl border border-white/15 flex items-center justify-center" style={{ backgroundColor: 'var(--color-backdrop-base)' }}>
                            <MessageSquare className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Messages</h1>
                        {!loading && (
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                                    <Mail className="w-3 h-3" /> {items.length} total
                                </span>
                                {unreadCount > 0 && (
                                    <span className="flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-0.5">
                                        <Mail className="w-3 h-3" /> {unreadCount} unread
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Toolbar: Search & Filter ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter & Sort Container */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                    {/* Sort Button */}
                    <button
                        onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-all shrink-0"
                        title={sortOrder === 'newest' ? 'Sort by Oldest' : 'Sort by Newest'}
                    >
                        <ArrowDownUp className="w-4 h-4" />
                        <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                    </button>

                    {/* Filter Tabs */}
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl shrink-0">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                filterStatus === 'all'
                                    ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            All ({items.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('unread')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                filterStatus === 'unread'
                                    ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('read')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                filterStatus === 'read'
                                    ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Read ({readCount})
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : items.length === 0 ? (
                <div className="relative rounded-2xl border border-white/8 border-dashed overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
                    <div className="relative py-24 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Mail className="w-7 h-7 text-gray-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-300 font-medium text-sm">No messages yet</p>
                            <p className="text-gray-600 text-xs mt-1">When visitors contact you, their messages will appear here.</p>
                        </div>
                    </div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="relative rounded-2xl border border-white/8 border-dashed overflow-hidden">
                    <div className="relative py-24 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Search className="w-7 h-7 text-gray-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-300 font-medium text-sm">No results found</p>
                            <p className="text-gray-600 text-xs mt-1">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredItems.map((item) => (
                        <MessageCard
                            key={item.id}
                            item={item}
                            onDelete={deleteItem}
                            onToggleRead={toggleReadStatus}
                            isExpanded={expandedId === item.id}
                            onToggleExpand={() => setExpandedId(prev => prev === item.id ? null : item.id)}
                        />
                    ))}
                </div>
            )}

            <ToastStack toasts={toasts} onDismiss={removeToast} />
        </div>
    )
}
