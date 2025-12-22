"use client";

import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function CariesRiskForm() {
  const [formData, setFormData] = useState({
    ans: 3,
    riwayat_karies: 3,
    saliva_type: "resting",
    saliva: {
      resting_saliva: {
        hydration: 2,
        viscosity: 1,
        ph: 1
      },
      stimulated_saliva: {
        quantity: 1,
        ph: 1,
        buffering: 1
      }
    },
    plaque: {
      ph: 1,
      maturity: 2
    },
    bacteria: {
      s_mutans: 1
    },
    diet: {
      sugar: 3,
      acid: 2
    },
    fluoride: {
      toothpaste: false,
      drinking_water: false,
      professional_treatment: false
    },
    modifying_factors: {
      drugs_decrease_saliva: false,
      disease_dry_mouth: false,
      prosthesis: false,
      poor_compliance: false,
      active_caries: false
    }
  });

  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSalivaTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      saliva_type: type
    }));
  };

  const getRiskColor = (value: number) => {
    if (value === 1) return "bg-green-500";
    if (value === 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFluorideScore = () => {
    const { toothpaste, drinking_water, professional_treatment } = formData.fluoride;
    if (toothpaste && !drinking_water && !professional_treatment) return 1;
    if (drinking_water && !professional_treatment) return 2;
    if (professional_treatment) return 3;
    return 1;
  };

  const getModifyingFactorsScore = () => {
    const { drugs_decrease_saliva, prosthesis } = formData.modifying_factors;
    if (drugs_decrease_saliva) return 1;
    if (!prosthesis) return 2;
    return 3;
  };

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDetect = async () => {
    setIsDetecting(true);
    setDetectionResult(null);

    try {
      const currentSaliva = formData.saliva_type === "resting" 
        ? formData.saliva.resting_saliva 
        : formData.saliva.stimulated_saliva;

      const payload = {
        "A&S": formData.ans,
        "Riwayat Karies": formData.riwayat_karies,
        "Saliva": {
          [formData.saliva_type === "resting" ? "resting_saliva" : "stimulated_saliva"]: currentSaliva
        },
        "Plaque": formData.plaque,
        "Bacteria": formData.bacteria,
        "Diet": formData.diet,
        "Fluoride": getFluorideScore(),
        "MF": getModifyingFactorsScore()
      };

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to detect");
      }

      const result = await response.json();
      setDetectionResult(result);
      alert("Deteksi berhasil!");
    } catch (error: any) {
      console.error("Detection error:", error);
      alert("Gagal melakukan deteksi: " + error.message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSaveToGolang = async () => {
    if (!detectionResult) return;

    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:8080/api/caries-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(detectionResult),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const result = await response.json();
      console.log("Save result:", result);
      alert("Data berhasil disimpan ke database!");
      
      // Reset form setelah berhasil simpan (opsional)
      // setDetectionResult(null);
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Gagal menyimpan data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Caries Risk Assessment</h1>
          <p className="text-gray-600 mb-8">Complete the form below to assess caries risk</p>

          <div className="space-y-8">
            {/* A&S Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Age & Special Needs (A&S)</h2>
              <div className="flex gap-4">
                {[1, 2, 3].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ans: val }))}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      formData.ans === val 
                        ? `${getRiskColor(val)} text-gray-800 border-transparent shadow-lg scale-105` 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{val === 1 ? 'Low' : val === 2 ? 'Medium' : 'High'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Riwayat Karies */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Riwayat Karies</h2>
              <div className="flex gap-4">
                {[1, 2, 3].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, riwayat_karies: val }))}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      formData.riwayat_karies === val 
                        ? `${getRiskColor(val)} text-gray-800 border-transparent shadow-lg scale-105` 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{val === 1 ? 'Low' : val === 2 ? 'Medium' : 'High'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saliva Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Saliva</h2>
              
              {/* Saliva Type Toggle */}
              <div className="mb-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSalivaTypeChange("resting")}
                  className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold text-gray-800 transition-all ${
                    formData.saliva_type === "resting"
                      ? 'bg-blue-600 text-gray-800 border-blue-600 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Resting Saliva
                </button>
                <button
                  type="button"
                  onClick={() => handleSalivaTypeChange("stimulated")}
                  className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold text-gray-800 transition-all ${
                    formData.saliva_type === "stimulated"
                      ? 'bg-blue-600 text-gray-800 border-blue-600 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Stimulated Saliva
                </button>
              </div>

              {/* Resting Saliva Fields */}
              {formData.saliva_type === "resting" && (
                <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-gray-700 mb-3">Resting Saliva Parameters</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hydration</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "resting_saliva", "hydration", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.resting_saliva.hydration === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 text-gray-800 text-gray-800 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Viscosity</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "resting_saliva", "viscosity", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.resting_saliva.viscosity === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 text-gray-800 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "resting_saliva", "ph", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.resting_saliva.ph === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 text-gray-800 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stimulated Saliva Fields */}
              {formData.saliva_type === "stimulated" && (
                <div className="space-y-4 bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-gray-700 mb-3">Stimulated Saliva Parameters</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "stimulated_saliva", "quantity", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.stimulated_saliva.quantity === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "stimulated_saliva", "ph", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.stimulated_saliva.ph === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buffering</label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleNestedChange("saliva", "stimulated_saliva", "buffering", val)}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            formData.saliva.stimulated_saliva.buffering === val 
                              ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                              : 'border-gray-300 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Plaque Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Plaque</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plaque pH</label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange("plaque", "ph", val)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                          formData.plaque.ph === val 
                            ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {val === 1 ? '7.0 (Green)' : val === 2 ? '6.0-8.5' : '> 5.5 (Red)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plaque Maturity</label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange("plaque", "maturity", val)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                          formData.plaque.maturity === val 
                            ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {val === 1 ? 'Blue Stain' : val === 2 ? 'Mixed' : 'Red Stain'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bacteria Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Bacteria</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">S. Mutans Count</label>
                <div className="flex gap-3">
                  {[1, 2, 3].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleChange("bacteria", "s_mutans", val)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        formData.bacteria.s_mutans === val 
                          ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {val === 1 ? '< 500,000' : val === 2 ? '500k-1M' : '> 500,000'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Diet Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Diet</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Exposure (# of exposures between meals)</label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange("diet", "sugar", val)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                          formData.diet.sugar === val 
                            ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {val === 1 ? 'Nil' : val === 2 ? '> 1' : '> 2'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acid Exposure (# of exposures between meals)</label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange("diet", "acid", val)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                          formData.diet.acid === val 
                            ? `${getRiskColor(val)} text-gray-800 border-transparent` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {val === 1 ? '< 2' : val === 2 ? '> 2' : '> 3'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fluoride Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Fluoride</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.fluoride.toothpaste}
                    onChange={(e) => handleChange("fluoride", "toothpaste", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Do you use fluoride toothpaste?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.fluoride.drinking_water}
                    onChange={(e) => handleChange("fluoride", "drinking_water", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Any fluoride in drinking water?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.fluoride.professional_treatment}
                    onChange={(e) => handleChange("fluoride", "professional_treatment", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Received professional fluoride treatment?</span>
                </label>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Fluoride Score: <span className={`inline-block px-3 py-1 rounded-full text-gray-800 ${getRiskColor(getFluorideScore())}`}>
                    {getFluorideScore()}
                  </span>
                </p>
              </div>
            </div>

            {/* Modifying Factors Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-gray-800 mb-4">Modifying Factors</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors.drugs_decrease_saliva}
                    onChange={(e) => handleChange("modifying_factors", "drugs_decrease_saliva", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Any drugs which can decrease salivary flow?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors.disease_dry_mouth}
                    onChange={(e) => handleChange("modifying_factors", "disease_dry_mouth", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Any disease which can cause dry mouth?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors.prosthesis}
                    onChange={(e) => handleChange("modifying_factors", "prosthesis", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Any fixed or removable prosthesis, including orthodontic appliances?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors.poor_compliance}
                    onChange={(e) => handleChange("modifying_factors", "poor_compliance", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Is compliance likely to be poor?</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors.active_caries}
                    onChange={(e) => handleChange("modifying_factors", "active_caries", e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Does patient have a recent episode of active caries?</span>
                </label>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Modifying Factors Score: <span className={`inline-block px-3 py-1 rounded-full text-gray-800 ${getRiskColor(getModifyingFactorsScore())}`}>
                    {getModifyingFactorsScore()}
                  </span>
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-800 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDetect}
                disabled={isDetecting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-gray-800 rounded-lg font-semibold text-gray-800 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Detecting...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Detect Risk
                  </>
                )}
              </button>
            </div>

            {/* Detection Result */}
            {detectionResult && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detection Result</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Level Card */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border-2 border-red-200">
                    <h3 className="text-lg font-semibold text-gray-800 text-gray-700 mb-2">Risk Level</h3>
                    <div className="text-4xl font-bold text-red-600 mb-2">{detectionResult.result}</div>
                    <div className="text-sm text-gray-600">Score: {detectionResult.score}</div>
                  </div>

                  {/* Confidence Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 text-gray-700 mb-2">Confidence</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-4">{detectionResult.confidence}</div>
                    <div className="space-y-2">
                      {Object.entries(detectionResult.confidence_detail).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">{key}:</span>
                          <span className="text-sm font-bold text-gray-800">{value.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-800 text-gray-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Description
                  </h3>
                  <p className="text-gray-700">{detectionResult.description}</p>
                </div>

                {/* Input Data Summary */}
                <div className="mt-6 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 text-gray-700 mb-4">Input Data Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">A&S:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data["A&S"]}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Riwayat Karies:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data["Riwayat Karies"]}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Fluoride:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data.Fluoride}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">MF:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data.MF}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sugar:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data.Diet.Sugar}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Acid:</span>
                      <span className="ml-2 font-semibold text-gray-800 text-gray-800">{detectionResult.data.Diet.Acid}</span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveToGolang}
                    disabled={isSaving}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-gray-800 rounded-xl font-semibold text-gray-800 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
                        Save to Database
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}