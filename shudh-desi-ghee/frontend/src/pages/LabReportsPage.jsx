import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Download } from 'lucide-react';
import { LAB_REPORTS } from '../data/rosierContent';

export default function LabReportsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2723]">Lab Reports</h1>
          <p className="text-[#5D4037] mt-3 max-w-xl mx-auto">
            Every batch of Shudh Desi Ghee is tested for purity, FSSAI compliance, and quality standards.
          </p>
        </div>
        <div className="space-y-4">
          {LAB_REPORTS.map((report) => (
            <div key={report.id} className="flex items-center justify-between gap-4 p-5 bg-white rounded-xl border border-[#E8DCC8] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[#FFF8E7]">
                  <FileCheck className="w-6 h-6 text-[#C8960C]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#3E2723]">{report.title}</h2>
                  <p className="text-sm text-[#5D4037] mt-0.5">{report.product}</p>
                  <span className="inline-block mt-2 text-xs font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {report.status}
                  </span>
                </div>
              </div>
              <button type="button" className="shrink-0 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#3E2723] border border-[#E8DCC8] px-3 py-2 rounded-lg hover:bg-[#3E2723] hover:text-white transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[#8D6E63] mt-8">
          Questions about our testing? <Link to="/contact" className="text-[#C8960C] font-semibold hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
