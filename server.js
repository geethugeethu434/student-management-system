require('dotenv').config();
// ======================================================
// STUDENT MANAGEMENT SYSTEM - COMPLETE BACKEND
// Node.js + Express + MongoDB
// ======================================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));



// ======================================================
// MONGODB CONNECTION
// ======================================================

const mongoUri = process.env.MONGO_URI;

console.log("MONGO_URI exists:", !!mongoUri);

if (!mongoUri) {
    console.error("ERROR: MONGO_URI is missing!");
} else {
    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log("MongoDB Connected Successfully!");
        })
        .catch((error) => {
            console.error("MongoDB Connection Error:", error);
        });
}

// ======================================================
// STUDENT SCHEMA
// ======================================================

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        attendance: {
            type: Number,
            default: 100
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model("Student", studentSchema);


// ======================================================
// ATTENDANCE SCHEMA
// ======================================================

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        status: {
            type: String,
            enum: ["Present", "Absent"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Attendance = mongoose.model(
    "Attendance",
    attendanceSchema
);


// ======================================================
// MARKS SCHEMA
// ======================================================

const marksSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        marks: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const Marks = mongoose.model("Marks", marksSchema);


// ======================================================
// COURSE SCHEMA
// ======================================================

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        students: {
            type: Number,
            default: 0
        },

        icon: {
            type: String,
            default: "📚"
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model("Course", courseSchema);


// ======================================================
// FEES SCHEMA
// ======================================================

const feeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        course: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["Paid", "Pending"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Fee = mongoose.model("Fee", feeSchema);


// ======================================================
// TIMETABLE SCHEMA
// ======================================================

const timetableSchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true
        },

        day: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Timetable = mongoose.model(
    "Timetable",
    timetableSchema
);


// ======================================================
// EVENT SCHEMA
// ======================================================

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        registered: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);


// ======================================================
// PROFILE SCHEMA
// ======================================================

const profileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "Admin",
            trim: true
        },

        role: {
            type: String,
            default: "Administrator",
            trim: true
        },

        email: {
            type: String,
            default: "admin@example.com",
            trim: true
        },

        department: {
            type: String,
            default: "AI & DS",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Profile = mongoose.model("Profile", profileSchema);


// ======================================================
// SETTINGS SCHEMA
// ======================================================

const settingsSchema = new mongoose.Schema(
    {
        notifications: {
            type: Boolean,
            default: true
        },

        emailAlerts: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model("Settings", settingsSchema);
// ======================================================
// PROFILE APIs
// ======================================================


// GET PROFILE

app.get("/api/profile", async (req, res) => {

    try {

        let profile = await Profile.findOne();

        if (!profile) {

            profile = new Profile({
                name: "Admin",
                role: "Administrator",
                email: "admin@example.com",
                department: "AI & DS"
            });

            await profile.save();
        }

        res.json(profile);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching profile"
        });

    }

});


// UPDATE PROFILE

app.put("/api/profile", async (req, res) => {

    try {

        let profile = await Profile.findOne();

        if (!profile) {
            profile = new Profile();
        }

        profile.name =
            req.body.name || profile.name;

        profile.role =
            req.body.role || profile.role;

        profile.email =
            req.body.email || profile.email;

        profile.department =
            req.body.department || profile.department;

        await profile.save();

        res.json(profile);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error updating profile"
        });

    }

});
// ======================================================
// SETTINGS APIs
// ======================================================


// GET SETTINGS

app.get("/api/settings", async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = new Settings({
                notifications: true,
                emailAlerts: true
            });

            await settings.save();
        }

        res.json(settings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching settings"
        });

    }

});


// UPDATE SETTINGS

app.put("/api/settings", async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings();
        }

        if (
            typeof req.body.notifications ===
            "boolean"
        ) {

            settings.notifications =
                req.body.notifications;
        }

        if (
            typeof req.body.emailAlerts ===
            "boolean"
        ) {

            settings.emailAlerts =
                req.body.emailAlerts;
        }

        await settings.save();

        res.json(settings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error updating settings"
        });

    }

});
// ======================================================
// GET ALL STUDENTS
// ======================================================

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("GET STUDENTS ERROR:", error);

        res.status(500).json({
            message: "Error fetching students"
        });
    }
});
// ======================================================
// ADD STUDENT
// ======================================================

app.post("/api/students", async (req, res) => {
    try {
        const {
            name,
            department,
            year,
            email
        } = req.body;

        if (!name || !department || !year || !email) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const student = new Student({
            name: name,
            department: department,
            year: year,
            email: email,
            attendance: 100
        });

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {
        console.error("ADD STUDENT ERROR:", error);

        res.status(500).json({
            message: "Error adding student"
        });
    }
});
// ======================================================
// UPDATE STUDENT
// ======================================================

app.put("/api/students/:id", async (req, res) => {
    try {
        const {
            name,
            department,
            year,
            email
        } = req.body;

        if (!name || !department || !year || !email) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                department,
                year,
                email
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(updatedStudent);

    } catch (error) {
        console.error("UPDATE STUDENT ERROR:", error);

        res.status(500).json({
            message: "Error updating student"
        });
    }
});
// ======================================================
// DELETE STUDENT
// ======================================================

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Delete related records also
        await Attendance.deleteMany({
            studentId: req.params.id
        });

        await Marks.deleteMany({
            studentId: req.params.id
        });

        await Fee.deleteMany({
            studentId: req.params.id
        });

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("DELETE STUDENT ERROR:", error);

        res.status(500).json({
            message: "Error deleting student"
        });
    }
});
// ======================================================
// GET ATTENDANCE
// ======================================================

app.get("/api/attendance", async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("studentId");

        res.json(attendance);

    } catch (error) {
        console.error("GET ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Error fetching attendance"
        });
    }
});
// ======================================================
// UPDATE ATTENDANCE
// ======================================================

app.put("/api/attendance/:studentId", async (req, res) => {
    try {

        const { status } = req.body;

        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({
                message: "Invalid attendance status"
            });
        }


        const student =
            await Student.findById(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // Find existing attendance record
        let attendance =
            await Attendance.findOne({
                studentId: req.params.studentId
            });


        if (attendance) {

            // Update existing record
            attendance.status = status;

            await attendance.save();

        } else {

            // Create record if it doesn't exist
            attendance =
                new Attendance({
                    studentId: req.params.studentId,
                    status: status
                });

            await attendance.save();
        }


        // Update student attendance percentage
        if (status === "Present") {
            student.attendance = 100;
        } else {
            student.attendance = 0;
        }

        await student.save();


        res.json({
            message: "Attendance updated successfully",
            attendance: attendance,
            student: student
        });


    } catch (error) {

        console.error(
            "UPDATE ATTENDANCE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error updating attendance"
        });

    }
});
// ======================================================
// GET ALL EVENTS
// ======================================================

app.get("/api/events", async (req, res) => {
    try {

        const events = await Event.find()
            .sort({ date: 1 });

        res.json(events);

    } catch (error) {

        console.error(
            "GET EVENTS ERROR:",
            error
        );

        res.status(500).json({
            message: "Error fetching events"
        });

    }
});
// ======================================================
// GET ALL TIMETABLE
// ======================================================

app.get("/api/timetable", async (req, res) => {
    try {

        const timetable = await Timetable.find()
            .sort({ day: 1, time: 1 });

        res.json(timetable);

    } catch (error) {

        console.error(
            "GET TIMETABLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error fetching timetable"
        });

    }
});
// ======================================================
// GET ALL FEES
// ======================================================

app.get("/api/fees", async (req, res) => {
    try {

        const fees = await Fee.find()
            .populate("studentId");

        res.json(fees);

    } catch (error) {

        console.error(
            "GET FEES ERROR:",
            error
        );

        res.status(500).json({
            message: "Error fetching fees"
        });

    }
});
// ======================================================
// GET ALL COURSES
// ======================================================

app.get("/api/courses", async (req, res) => {
    try {

        const courses = await Course.find()
            .sort({ name: 1 });

        res.json(courses);

    } catch (error) {

        console.error(
            "GET COURSES ERROR:",
            error
        );

        res.status(500).json({
            message: "Error fetching courses"
        });

    }
});
// ======================================================
// GET ALL MARKS
// ======================================================

app.get("/api/marks", async (req, res) => {
    try {

        const marks = await Marks.find()
            .populate("studentId");

        res.json(marks);

    } catch (error) {

        console.error(
            "GET MARKS ERROR:",
            error
        );

        res.status(500).json({
            message: "Error fetching marks"
        });

    }
});
// ======================================================
// ADD MARKS
// ======================================================

app.post("/api/marks", async (req, res) => {
    try {

        const {
            studentId,
            subject,
            marks
        } = req.body;

        if (!studentId || !subject || marks === undefined) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        if (marks < 0 || marks > 100) {
            return res.status(400).json({
                message: "Marks must be between 0 and 100"
            });
        }

        const student =
            await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const newMarks = new Marks({
            studentId: studentId,
            subject: subject,
            marks: Number(marks)
        });

        const savedMarks =
            await newMarks.save();

        const populatedMarks =
            await Marks.findById(savedMarks._id)
                .populate("studentId");

        res.status(201).json(populatedMarks);

    } catch (error) {

        console.error(
            "ADD MARKS ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding marks"
        });

    }
});
// ======================================================
// DELETE MARKS
// ======================================================

app.delete("/api/marks/:id", async (req, res) => {
    try {

        const deletedMarks =
            await Marks.findByIdAndDelete(
                req.params.id
            );

        if (!deletedMarks) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }

        res.json({
            message: "Marks deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE MARKS ERROR:",
            error
        );

        res.status(500).json({
            message: "Error deleting marks"
        });

    }
});
// ======================================================
// ADD COURSE
// ======================================================

app.post("/api/courses", async (req, res) => {
    try {

        const {
            name,
            department,
            students,
            icon
        } = req.body;

        if (!name || !department || students === undefined) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const newCourse = new Course({
            name: name,
            department: department,
            students: Number(students),
            icon: icon || "📚"
        });

        const savedCourse =
            await newCourse.save();

        res.status(201).json(savedCourse);

    } catch (error) {

        console.error(
            "ADD COURSE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding course"
        });

    }
});
// ======================================================
// DELETE COURSE
// ======================================================

app.delete("/api/courses/:id", async (req, res) => {
    try {

        const deletedCourse =
            await Course.findByIdAndDelete(
                req.params.id
            );

        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE COURSE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error deleting course"
        });

    }
});
// ======================================================
// ADD FEE
// ======================================================

app.post("/api/fees", async (req, res) => {
    try {

        const {
            studentId,
            course,
            amount,
            status
        } = req.body;

        if (!studentId || !course || amount === undefined || !status) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const student =
            await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const newFee = new Fee({
            studentId: studentId,
            course: course,
            amount: Number(amount),
            status: status
        });

        const savedFee =
            await newFee.save();

        const populatedFee =
            await Fee.findById(savedFee._id)
                .populate("studentId");

        res.status(201).json(populatedFee);

    } catch (error) {

        console.error(
            "ADD FEE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding fee"
        });

    }
});
// ======================================================
// DELETE FEE
// ======================================================

app.delete("/api/fees/:id", async (req, res) => {
    try {

        const deletedFee =
            await Fee.findByIdAndDelete(
                req.params.id
            );

        if (!deletedFee) {
            return res.status(404).json({
                message: "Fee record not found"
            });
        }

        res.json({
            message: "Fee deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE FEE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error deleting fee"
        });

    }
});
// ======================================================
// ADD TIMETABLE
// ======================================================

app.post("/api/timetable", async (req, res) => {
    try {

        const {
            time,
            day,
            subject
        } = req.body;

        if (!time || !day || !subject) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const newTimetable = new Timetable({
            time: time,
            day: day,
            subject: subject
        });

        const savedTimetable =
            await newTimetable.save();

        res.status(201).json(savedTimetable);

    } catch (error) {

        console.error(
            "ADD TIMETABLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding timetable"
        });

    }
});
// ======================================================
// ADD TIMETABLE
// ======================================================

app.post("/api/timetable", async (req, res) => {
    try {

        const {
            time,
            day,
            subject
        } = req.body;

        if (!time || !day || !subject) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const newTimetable = new Timetable({
            time: time,
            day: day,
            subject: subject
        });

        const savedTimetable =
            await newTimetable.save();

        res.status(201).json(savedTimetable);

    } catch (error) {

        console.error(
            "ADD TIMETABLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding timetable"
        });

    }
});
// ======================================================
// DELETE TIMETABLE
// ======================================================

app.delete("/api/timetable/:id", async (req, res) => {
    try {

        const deletedTimetable =
            await Timetable.findByIdAndDelete(
                req.params.id
            );

        if (!deletedTimetable) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        res.json({
            message: "Timetable deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE TIMETABLE ERROR:",
            error
        );

        res.status(500).json({
            message: "Error deleting timetable"
        });

    }
});
// ======================================================
// ADD EVENT
// ======================================================

app.post("/api/events", async (req, res) => {
    try {

        const {
            name,
            type,
            date,
            location
        } = req.body;

        if (!name || !type || !date || !location) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const newEvent = new Event({
            name: name,
            type: type,
            date: date,
            location: location,
            registered: 0
        });

        const savedEvent = await newEvent.save();

        res.status(201).json(savedEvent);

    } catch (error) {

        console.error(
            "ADD EVENT ERROR:",
            error
        );

        res.status(500).json({
            message: "Error adding event"
        });

    }
});
// ======================================================
// DELETE EVENT
// ======================================================

app.delete("/api/events/:id", async (req, res) => {
    try {

        const deletedEvent =
            await Event.findByIdAndDelete(
                req.params.id
            );

        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE EVENT ERROR:",
            error
        );

        res.status(500).json({
            message: "Error deleting event"
        });

    }
});
// ======================================================
// DASHBOARD API
// ======================================================

app.get("/api/dashboard", async (req, res) => {

    try {

        const totalStudents =
            await Student.countDocuments();

        const totalCourses =
            await Course.countDocuments();

        const totalEvents =
            await Event.countDocuments();

        const absentCount =
            await Attendance.countDocuments({
                status: "Absent"
            });

        const presentCount =
            Math.max(
                totalStudents - absentCount,
                0
            );

        const paidFees =
            await Fee.aggregate([
                {
                    $match: {
                        status: "Paid"
                    }
                },

                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);

        const pendingFees =
            await Fee.aggregate([
                {
                    $match: {
                        status: "Pending"
                    }
                },

                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);

        res.json({

            totalStudents,

            totalCourses,

            totalEvents,

            presentCount,

            absentCount,

            feesCollected:
                paidFees.length > 0
                    ? paidFees[0].total
                    : 0,

            feesPending:
                pendingFees.length > 0
                    ? pendingFees[0].total
                    : 0

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error loading dashboard"
        });

    }

});
// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});