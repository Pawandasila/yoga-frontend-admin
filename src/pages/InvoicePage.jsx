import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer } from 'lucide-react';

const InvoicePage = ({ payment }) => {
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (payment) {
      setInvoiceDetails({
        invoiceNumber: `INV-${payment.order_id.slice(-6)}`,
        studentName: payment.name,
        yogaClass: payment.yogaClassName,
        amount: payment.amount,
        date: new Date(payment.createdAt),
        status: payment.status
      });
    }
  }, [payment]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, you'd implement actual PDF generation
    alert('Download functionality to be implemented');
  };

  if (!invoiceDetails) {
    return <div>Loading invoice details...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <FileText className="h-10 w-10 text-blue-600 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Invoice Number: {invoiceDetails.invoiceNumber}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bill To</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {invoiceDetails.studentName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Date</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {invoiceDetails.date.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
        <div className="flex justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {invoiceDetails.yogaClass}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              ${invoiceDetails.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              invoiceDetails.status === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {invoiceDetails.status}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Total: ${invoiceDetails.amount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;