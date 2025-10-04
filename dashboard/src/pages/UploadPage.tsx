import Layout from '../components/Layout/Layout';
import CSVUpload from '../components/CSVUpload';

export default function UploadPage() {
  const handleUploadSuccess = () => {
    // Optionally refresh dashboard data or show success message
    console.log('CSV upload completed successfully');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload Inventory Data</h2>
        <p className="text-gray-600 mt-1">Import inventory data from CSV files</p>
      </div>

      <CSVUpload onUploadSuccess={handleUploadSuccess} />
    </Layout>
  );
}
