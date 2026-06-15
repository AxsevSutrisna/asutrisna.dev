import { useEffect, useState} from"react";
import ReactDOM from"react-dom";
import { supabase} from"../../supabase";
import { useToast} from"../../hooks/useToast";
import ToastStack from"../../components/ToastStack";
import {
 Plus,
 Trash2,
 Upload,
 BookOpen,
 X,
 ImageIcon,
 Pencil,
 Building,
 Calendar,
 Link as LinkIcon,
} from"lucide-react";

// Modal Component
const Modal = ({ title, onClose, children}) =>
 ReactDOM.createPortal(
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
 <div
 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
 onClick={onClose}
 />
 <div
 className="relative z-10 w-full max-w-2xl flex flex-col"
 style={{ maxHeight:"calc(100vh - 24px)"}}
 >
 <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
 <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0 bg-white/5">
 <h2 className="text-base font-semibold text-white">{title}</h2>
 <button
 type="button"
 onClick={onClose}
 className="p-1 text-gray-500 hover:text-white transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 <div className="overflow-y-auto flex-1">{children}</div>
 </div>
 </div>
 </div>,
 document.body
 );

// Course Form
const CourseForm = ({ initial, onSubmit, onCancel, submitLabel ="Save Course", uploading}) => {
 const [form, setForm] = useState({
 title: initial?.title ||"",
 provider: initial?.provider ||"",
 completion_date: initial?.completion_date ||"",
 certificate_link: initial?.certificate_link ||"",
 description: initial?.description ||"",
});
 
 const [file, setFile] = useState(null);
 const [preview, setPreview] = useState(initial?.img_url || null);

 const set = (key) => (e) => {
 setForm((f) => ({ ...f, [key]: e.target.value}));
};

 const handleFileChange = (e) => {
 const f = e.target.files[0];
 if (f) {
 setFile(f);
 setPreview(URL.createObjectURL(f));
}
};

 const handleSubmit = (e) => {
 e.preventDefault();
 if (!form.title || !form.provider) return;
 onSubmit(form, file);
};

 const inputCls ="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all";
 const labelCls ="text-xs text-indigo-300/70 uppercase tracking-wider font-medium mb-1.5 block";

 return (
 <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Title */}
 <div className="sm:col-span-2">
 <label className={labelCls}>Course Title *</label>
 <input
 type="text"
 value={form.title}
 onChange={set("title")}
 placeholder="e.g. Fullstack React Developer"
 required
 className={inputCls}
 />
 </div>

 {/* Provider */}
 <div>
 <label className={labelCls}>Provider *</label>
 <div className="relative">
 <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="text"
 value={form.provider}
 onChange={set("provider")}
 placeholder="e.g. Coursera, Udemy"
 required
 className={`${inputCls} pl-10`}
 />
 </div>
 </div>

 {/* Date */}
 <div>
 <label className={labelCls}>Completion Date</label>
 <div className="relative">
 <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="date"
 value={form.completion_date}
 onChange={set("completion_date")}
 className={`${inputCls} pl-10 [color-scheme:dark]`}
 />
 </div>
 </div>

 {/* Link */}
 <div className="sm:col-span-2">
 <label className={labelCls}>Certificate Link (URL)</label>
 <div className="relative">
 <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="url"
 value={form.certificate_link}
 onChange={set("certificate_link")}
 placeholder="https://credential.net/..."
 className={`${inputCls} pl-10`}
 />
 </div>
 </div>

 {/* Description */}
 <div className="sm:col-span-2">
 <label className={labelCls}>Description</label>
 <textarea
 value={form.description}
 onChange={set("description")}
 placeholder="What did you learn in this course?"
 rows={3}
 className={`${inputCls} resize-none`}
 />
 </div>

 {/* Image */}
 <div className="sm:col-span-2">
 <label className={labelCls}>Course Image / Badge</label>
 <div className="flex items-center gap-4">
 {preview ? (
 <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
 ) : (
 <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
 <ImageIcon className="w-6 h-6 text-gray-500" />
 </div>
 )}
 <label className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer text-sm text-white transition-colors">
 Choose Image
 <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
 </label>
 </div>
 </div>

 </div>

 {/* Actions */}
 <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
 <button
 type="button"
 onClick={onCancel}
 className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={uploading}
 className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
 >
 {uploading ? (
 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
 ) : (
 <Upload className="w-4 h-4" />
 )}
 {uploading ?"Saving..." : submitLabel}
 </button>
 </div>
 </form>
 );
};

// Course Card
const CourseCard = ({ course, onEdit, onDelete}) => {
 return (
 <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
 <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/8 shrink-0 flex items-center justify-center">
 {course.img_url ? (
 <img src={course.img_url} alt={course.title} className="w-full h-full object-cover" />
 ) : (
 <BookOpen className="w-6 h-6 text-gray-500" />
 )}
 </div>
 
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
 <p className="text-xs text-gray-400 truncate">{course.provider}</p>
 {course.completion_date && (
 <p className="text-[10px] text-gray-500 mt-0.5">{course.completion_date}</p>
 )}
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => onEdit(course)}
 className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
 >
 <Pencil className="w-4 h-4" />
 </button>
 <button
 onClick={() => onDelete(course.id)}
 className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 );
};

export default function Courses() {
 const [courses, setCourses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showCreate, setShowCreate] = useState(false);
 const [editCourse, setEditCourse] = useState(null);
 const [uploading, setUploading] = useState(false);
 const { toasts, pushToast, removeToast} = useToast();

 const fetchCourses = async () => {
 setLoading(true);
 const { data, error} = await supabase.from("courses").select("*").order("created_at", { ascending: false});
 if (error) {
 console.error(error);
 pushToast("error","Failed to fetch courses.");
} else {
 setCourses(data || []);
}
 setLoading(false);
};

 useEffect(() => {
 fetchCourses();
}, []);

 const uploadImage = async (file) => {
 const fileName = `course-${Date.now()}-${file.name}`;
 const { error: uploadError} = await supabase.storage.from("course-images").upload(fileName, file);
 if (uploadError) throw uploadError;
 const { data} = supabase.storage.from("course-images").getPublicUrl(fileName);
 return data.publicUrl;
};

 const handleCreate = async (form, file) => {
 setUploading(true);
 try {
 let img_url = null;
 if (file) {
 img_url = await uploadImage(file);
}
 
 const { error} = await supabase.from("courses").insert([{ ...form, img_url}]);
 if (error) throw error;
 
 pushToast("success","Course added successfully!");
 setShowCreate(false);
 fetchCourses();
} catch (err) {
 console.error(err);
 pushToast("error","Failed to create course.");
} finally {
 setUploading(false);
}
};

 const handleUpdate = async (form, file) => {
 setUploading(true);
 try {
 let img_url = editCourse.img_url;
 if (file) {
 img_url = await uploadImage(file);
}

 const { error} = await supabase.from("courses").update({ ...form, img_url}).eq("id", editCourse.id);
 if (error) throw error;

 pushToast("success","Course updated successfully!");
 setEditCourse(null);
 fetchCourses();
} catch (err) {
 console.error(err);
 pushToast("error","Failed to update course.");
} finally {
 setUploading(false);
}
};

 const handleDelete = async (id) => {
 if (!confirm("Are you sure you want to delete this course?")) return;
 try {
 const { error} = await supabase.from("courses").delete().eq("id", id);
 if (error) throw error;
 pushToast("success","Course deleted successfully!");
 fetchCourses();
} catch (err) {
 console.error(err);
 pushToast("error","Failed to delete course.");
}
};

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
 <BookOpen className="w-5 h-5 text-indigo-400" />
 </div>
 <div>
 <h1 className="text-xl font-bold text-white">Courses</h1>
 <p className="text-sm text-gray-400">Manage your educational courses and bootcamp certificates</p>
 </div>
 </div>
 <button
 onClick={() => setShowCreate(true)}
 className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
 >
 <Plus className="w-4 h-4" />
 Add Course
 </button>
 </div>

 <div className="bg-[#0a0a1a] rounded-2xl border border-white/5 p-4 sm:p-6">
 {loading ? (
 <div className="text-center py-10 text-gray-400">Loading courses...</div>
 ) : courses.length === 0 ? (
 <div className="text-center py-10">
 <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
 <h3 className="text-lg font-medium text-white mb-1">No courses found</h3>
 <p className="text-gray-400 text-sm">Add your first course to show on your portfolio.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {courses.map((course) => (
 <CourseCard key={course.id} course={course} onEdit={setEditCourse} onDelete={handleDelete} />
 ))}
 </div>
 )}
 </div>

 {showCreate && (
 <Modal title="Add New Course" onClose={() => setShowCreate(false)}>
 <CourseForm
 onSubmit={handleCreate}
 onCancel={() => setShowCreate(false)}
 uploading={uploading}
 submitLabel="Create Course"
 />
 </Modal>
 )}

 {editCourse && (
 <Modal title="Edit Course" onClose={() => setEditCourse(null)}>
 <CourseForm
 initial={editCourse}
 onSubmit={handleUpdate}
 onCancel={() => setEditCourse(null)}
 uploading={uploading}
 submitLabel="Save Changes"
 />
 </Modal>
 )}

 <ToastStack toasts={toasts} onDismiss={removeToast} />
 </div>
 );
}
