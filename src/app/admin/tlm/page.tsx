"use client";
import { useState, useEffect } from "react";
import { Save, AlertCircle, Activity, Droplet, Apple, Shield, AlertTriangle, Calendar } from "lucide-react";
import Swal from "sweetalert2";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const PREDICTION_SAVE_ENDPOINT = "/prediction/save";

export default function CariesRiskForm() {
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    date_of_evaluation: "",
    attitude: 1,
    diseaseStatus: 1,
    saliva_type: "resting",
    saliva: {
      hydration: 1,
      viscosity: 1,
      ph: 1,
      quantity: 1,
      buffering: 1,
    },
    plaque_type: "ph",
    plaque: {
      ph: 1,
      maturity: 1,
    },
    bacteria: 1,
    diet: {
      sugar: 1,
      acid: 1,
    },
    fluoride: {
      toothpaste: false,
      drinking_water: false,
      professional_treatment: false,
    },
    modifying_factors: {
      drugs_decrease_saliva: false,
      disease_dry_mouth: false,
      prosthesis: false,
      poor_compliance: false,
      active_caries: false,
    },
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const attitudeOptions = [
    { label: "A = No current disease", value: 1 },
    { label: "B = Need for repair, maintenance", value: 2 },
    { label: "C = Active disease", value: 3 },
  ];
  const salivaOptions: { [key: string]: { label: string; value: number }[] } = {
    hydration: [
      { label: ">60 sec", value: 3 },
      { label: "30-60 sec", value: 2 },
      { label: "<30 sec", value: 1 },
    ],
    viscosity: [
      { label: "Sticky", value: 3 },
      { label: "Frothy", value: 2 },
      { label: "Watery", value: 1 },
    ],
    ph: [
      { label: "5.0-5.8", value: 3 },
      { label: "5.8-6.8", value: 2 },
      { label: "6.8-7.8", value: 1 },
    ],
    quantity: [
      { label: "<15 ml", value: 3 },
      { label: "15-50 ml", value: 2 },
      { label: ">50 ml", value: 1 },
    ],
    buffering: [
      { label: "0-5 pts", value: 3 },
      { label: "6-9 pts", value: 2 },
      { label: "10-12 pts", value: 1 },
    ],
  };
  const plaqueOptions: { [key: string]: { label: string; value: number }[] } = {
    ph: [
      { label: "5.5", value: 3 },
      { label: "6.0-6.5", value: 2 },
      { label: "7.0", value: 1 },
    ],
    maturity: [
      { label: "BLUE STAIN", value: 3 },
      { label: "RED STAIN", value: 1 },
    ],
  };
  const bacteriaOptions = [
    { label: ">500,000", value: 3 },
    { label: "<500,000", value: 1 },
  ];
  const dietOptions: { [key: string]: { label: string; value: number }[] } = {
    sugar: [
      { label: ">2", value: 3 },
      { label: ">1", value: 2 },
      { label: "Nil", value: 1 },
    ],
    acid: [
      { label: ">3", value: 3 },
      { label: ">2", value: 2 },
      { label: "<2", value: 1 },
    ],
  };

  const getRiskColor = (v: number) =>
    v === 1 ? "bg-green-500 hover:bg-green-600" : v === 2 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600";

  const getActiveClass = (isActive: boolean) =>
    isActive ? "ring-4 ring-blue-600 ring-offset-2 scale-105 shadow-lg" : "hover:scale-102";

  const getBacteriaScore = () => formData.bacteria;
  const getFluorideScore = () => {
    const count = Object.values(formData.fluoride).filter(Boolean).length;
    if (count === 0) return 3; // Semua tidak, merah
    if (count >= 1 && count <= 2) return 2; // 1-2 yes, kuning
    return 1; // 3 yes, hijau
  };

  const getModifyingFactorsScore = () => {
    const count = Object.values(formData.modifying_factors).filter(Boolean).length;
    if (count === 0) return 1; // Semua no, hijau
    return 3; // Ada 1 atau lebih yes, merah
  };

  const getFluorideColor = () => {
    const score = getFluorideScore();
    return score === 1 ? "bg-green-500" : score === 2 ? "bg-yellow-500" : "bg-red-500";
  };

  const getModifyingFactorsColor = () => {
    const score = getModifyingFactorsScore();
    return score === 1 ? "bg-green-500" : "bg-red-500";
  };

  const getSalivaPayload = () => {
    if (formData.saliva_type === "resting") {
      return {
        resting_saliva: {
          Hydration: formData.saliva.hydration,
          Viscosity: formData.saliva.viscosity,
          Ph: formData.saliva.ph,
        },
      };
    }

    return {
      stimulated_saliva: {
        Quantity: formData.saliva.quantity,
        Ph: formData.saliva.ph,
        Buffering: formData.saliva.buffering,
      },
    };
  };

  const getPlaquePayload = () => {
    return formData.plaque_type === "maturity"
      ? { Maturity: formData.plaque.maturity }
      : { Ph: formData.plaque.ph };
  };

  const formatDateTimeForAPI = (dateString: string) => {
    if (!dateString) return new Date().toISOString();
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleDetect = async () => {
    setIsDetecting(true);
    setDetectionResult(null);
    const payload = {
      "attitude_and_status": formData.attitude,
      "caries_history": getBacteriaScore(),
      "Saliva": getSalivaPayload(),
      "Plaque": getPlaquePayload(),
      "Diet": {
        Sugar: formData.diet.sugar,
        Acid: formData.diet.acid,
      },
      "Fluoride": getFluorideScore(),
      "modifying_factor": getModifyingFactorsScore(),
    };

    try {
      const res = await fetch("https://web-production-b2442.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal deteksi");
      const result = await res.json();
      setDetectionResult(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    setToken(t);
  }, []);

  const handleSave = async () => {
    if (!detectionResult) return;
    setIsSaving(true);
    try {
      const payload = {
        patient_name: formData.patient_name,
        age: Number(formData.age),
        date_of_evaluation: formatDateTimeForAPI(formData.date_of_evaluation),
        result: detectionResult.result,
        score: detectionResult.score,
        color: detectionResult.color,
        confidence: detectionResult.confidence,
        confidence_detail: detectionResult.confidence_detail,
        description: detectionResult.description,
        caries_risk: detectionResult.data,
      };

      await fetch(`${API_BASE_URL}${PREDICTION_SAVE_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data prediksi berhasil disimpan",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: err.message || "Server error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Traffic Light Assesment
            </h1>
            <p className="text-gray-600">Complete the form to evaluate dental caries risk</p>
          </div>

          {/* Patient Information */}
          <section className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">Patient Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_name: e.target.value })
                  }
                  placeholder="Enter patient name"
                  className="w-full p-4 text-gray-800 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Enter age"
                  className="w-full p-4 text-gray-800 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              {/* Date of Evaluation */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Date of Evaluation
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={formData.date_of_evaluation}
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_evaluation: e.target.value })
                    }
                    className="w-full p-4 pl-12 text-gray-800 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Attitude */}
          <section className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Attitude & Disease Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {attitudeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, attitude: opt.value })}
                  className={`p-4 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.attitude === opt.value)}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Saliva */}
          <section className="mb-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-100">
            <div className="flex items-center gap-3 mb-4">
              <Droplet className="w-6 h-6 text-cyan-600" />
              <h2 className="text-xl font-bold text-gray-800">Saliva</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["resting", "stimulated"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, saliva_type: t })}
                  className={`p-4 rounded-xl font-semibold border-2 transition-all ${formData.saliva_type === t
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                >
                  {t === "resting" ? "Resting Saliva" : "Stimulated Saliva"}
                </button>
              ))}
            </div>
            {formData.saliva_type === "resting" &&
              ["hydration", "viscosity", "ph"].map((f) => (
                <div key={f} className="mb-5">
                  <p className="mb-3 font-semibold text-gray-700 capitalize text-lg">{f}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {salivaOptions[f].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            saliva: { ...formData.saliva, [f]: opt.value },
                          })
                        }
                        className={`p-3 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.saliva[f as keyof typeof formData.saliva] === opt.value)}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            {formData.saliva_type === "stimulated" &&
              ["quantity", "ph", "buffering"].map((f) => (
                <div key={f} className="mb-5">
                  <p className="mb-3 font-semibold text-gray-700 capitalize text-lg">{f}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {salivaOptions[f].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            saliva: { ...formData.saliva, [f]: opt.value },
                          })
                        }
                        className={`p-3 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.saliva[f as keyof typeof formData.saliva] === opt.value)}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </section>

          {/* Plaque */}
          <section className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Plaque</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["ph", "maturity"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, plaque_type: t })}
                  className={`p-4 rounded-xl font-semibold border-2 transition-all ${formData.plaque_type === t
                    ? "bg-amber-600 text-white border-amber-600 shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                    }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plaqueOptions[formData.plaque_type].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      plaque: {
                        ...formData.plaque,
                        [formData.plaque_type]: opt.value,
                      },
                    })
                  }
                  className={`p-4 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.plaque[formData.plaque_type as keyof typeof formData.plaque] === opt.value)}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Bacteria */}
          <section className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Caries History</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bacteriaOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, bacteria: opt.value })}
                  className={`p-4 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.bacteria === opt.value)}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Diet */}
          <section className="mb-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-100">
            <div className="flex items-center gap-3 mb-4">
              <Apple className="w-6 h-6 text-rose-600" />
              <h2 className="text-xl font-bold text-gray-800">Diet</h2>
            </div>
            {["sugar", "acid"].map((f) => (
              <div key={f} className="mb-5">
                <p className="mb-3 font-semibold text-gray-700 capitalize text-lg">
                  {f} Exposure (# between meals)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dietOptions[f].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          diet: { ...formData.diet, [f]: opt.value },
                        })
                      }
                      className={`p-3 rounded-xl font-semibold text-white transition-all ${getRiskColor(opt.value)} ${getActiveClass(formData.diet[f as keyof typeof formData.diet] === opt.value)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Fluoride */}
          <section className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Fluoride</h2>
            </div>
            <div className="space-y-3">
              {Object.keys(formData.fluoride).map((k) => (
                <label key={k} className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.fluoride[k as keyof typeof formData.fluoride]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fluoride: {
                          ...formData.fluoride,
                          [k]: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="font-medium text-gray-700 capitalize">
                    {k.replaceAll("_", " ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl">
              <div className={`inline-block px-4 py-2 rounded-lg ${getFluorideColor()}`}>
                <p className="text-sm font-semibold text-white">
                  Fluoride Score: {getFluorideScore()}
                </p>
              </div>
            </div>
          </section>

          {/* Modifying Factors */}
          <section className="mb-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-violet-600" />
              <h2 className="text-xl font-bold text-gray-800">Modifying Factors</h2>
            </div>
            <div className="space-y-3">
              {Object.keys(formData.modifying_factors).map((k) => (
                <label key={k} className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-violet-400 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.modifying_factors[k as keyof typeof formData.modifying_factors]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        modifying_factors: {
                          ...formData.modifying_factors,
                          [k]: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="font-medium text-gray-700 capitalize">
                    {k.replaceAll("_", " ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl">
              <div className={`inline-block px-4 py-2 rounded-lg ${getModifyingFactorsColor()}`}>
                <p className="text-sm font-semibold text-white">
                  Modifying Factors Score: {getModifyingFactorsScore()}
                </p>
              </div>
            </div>
          </section>

          {/* Detect Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleDetect}
              disabled={isDetecting}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isDetecting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Detecting...
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6" />
                  Detect Risk Level
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {detectionResult && (
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 shadow-inner">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Detection Result</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Risk Level */}
                <div className={`p-6 rounded-2xl shadow-lg border-3 ${detectionResult.result === "high" ? "bg-gradient-to-br from-red-500 to-red-600 border-red-700" :
                  detectionResult.result === "medium" ? "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-700" :
                    "bg-gradient-to-br from-green-500 to-green-600 border-green-700"
                  }`}>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Risk Level</h3>
                  <div className="text-5xl font-black text-white mb-2 capitalize">{detectionResult.result}</div>
                  <div className="text-white/90 font-semibold">Score: {detectionResult.score}</div>
                </div>

                {/* Confidence */}
                <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border-3 border-blue-700">
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Confidence</h3>
                  <div className="text-5xl font-black text-white mb-4">{detectionResult.confidence}</div>
                  <div className="space-y-2">
                    {Object.entries(detectionResult.confidence_detail).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center bg-white/20 p-2 rounded-lg capitalize">
                        <span className="font-semibold text-white">{key}:</span>
                        <span className="font-bold text-white">{value.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-300 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Description & Recommendation</h3>
                    <p className="text-gray-700 leading-relaxed">{detectionResult.description}</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-7 h-7" />
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
  );
}