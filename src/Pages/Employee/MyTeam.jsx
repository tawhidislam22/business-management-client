import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyTeam = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: teamInfo = {}, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get(`/users/team/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const { data: teamAssets = [], isLoading: isAssetsLoading } = useQuery({
    queryKey: ['team-assets', teamInfo?.company],
    queryFn: async () => {
      if (!teamInfo?.company) return [];
      const res = await axiosSecure.get(`/assets/company/${teamInfo.company}`);
      return res.data;
    },
    enabled: !!teamInfo?.company
  });

  if (isTeamLoading || isAssetsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!teamInfo.company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">You are not part of any team yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">My Team</h2>

      {/* Company Info */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center gap-4">
            {teamInfo.companyLogo && (
              <img
                src={teamInfo.companyLogo}
                alt={teamInfo.companyName}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.src = '/default-company-logo.png';
                }}
              />
            )}
            <div>
              <h3 className="text-2xl font-bold">{teamInfo.companyName}</h3>
              <p className="text-gray-600">
                Team Size: {teamInfo.members?.length || 0} members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamInfo.members?.map((member) => (
            <div key={member.email} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
                      <img
                        src={member.photoURL || '/default-avatar.png'}
                        alt={member.name}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm">
                      <span className={`badge ${
                        member.role === 'hr' ? 'badge-primary' : 'badge-secondary'
                      }`}>
                        {member.role === 'hr' ? 'HR Manager' : 'Employee'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{member.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Assets */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Team Assets</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {teamAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={asset.image || '/default-asset.png'}
                        alt={asset.name}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          e.target.src = '/default-asset.png';
                        }}
                      />
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {asset.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      asset.status === 'available' ? 'badge-success' :
                      asset.status === 'in-use' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td>
                    {asset.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img
                              src={asset.assignedTo.photoURL || '/default-avatar.png'}
                              alt={asset.assignedTo.name}
                              onError={(e) => {
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                          </div>
                        </div>
                        <span>{asset.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td>
                    {asset.updatedAt ? (
                      <span className="text-sm text-gray-600">
                        {new Date(asset.updatedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teamAssets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No team assets available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam; 