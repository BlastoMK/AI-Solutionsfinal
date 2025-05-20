// controllers/adminController.js
exports.getDashboardStats = async (req, res) => {
    try {
      const [enquiries, events, registrations, recentEnquiries] = await Promise.all([
        Enquiry.countDocuments(),
        Event.countDocuments(),
        Registration.countDocuments(),
        Enquiry.find({ status: 'new' })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name company createdAt')
      ]);
  
      res.json({
        counts: { enquiries, events, registrations },
        recentEnquiries,
        chartData: await getRegistrationTrends() // Separate function
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  async function getRegistrationTrends() {
    return Event.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'eventId',
          as: 'attendees'
        }
      },
      {
        $project: {
          name: '$title',
          date: 1,
          registrations: { $size: '$attendees' },
          registrationRate: {
            $cond: [
              { $eq: ['$maxAttendees', 0] },
              0,
              { $divide: [{ $size: '$attendees' }, '$maxAttendees'] }
            ]
          }
        }
      }
    ]);
  }