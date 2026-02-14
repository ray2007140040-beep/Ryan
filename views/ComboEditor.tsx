
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { TechPack } from '../types';

interface ComboEditorProps {
  existingLibrary: TechPack[];
  onSave: (newCombos: TechPack[]) => void;
  onCancel: () => void;
}

interface GeneratedVariation extends TechPack {
  selected: boolean;
}

const ComboEditor: React.FC<ComboEditorProps> = ({ existingLibrary, onSave, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<GeneratedVariation[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleGenerate = async () => {
    if (selectedIds.length < 2) return;
    setIsGenerating(true);

    const selectedPacks = existingLibrary.filter(p => selectedIds.includes(p.id));
    const packTitles = selectedPacks.map(p => p.title).join(', ');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // We remove the strict responseSchema to prevent RPC/XHR errors (Code 6) 
      // which can occur with complex nested schemas on the preview model.
      // Instead, we use system instructions to enforce the structure.

      const systemInstruction = `You are a world-class MMA/Boxing coach. 
      Generate 3 distinct, professional tactical variations based on the provided base actions. 
      
      REQUIRED JSON STRUCTURE:
      {
        "variations": [
          {
            "title": "String (Name of the combo)",
            "category": "String (e.g. Striking, Grappling)",
            "levels": {
              "l1": { "steps": ["String"], "points": ["String"] },
              "l2": { "steps": ["String"], "points": ["String"] },
              "l3": { "steps": ["String"], "points": ["String"] }
            }
          }
        ]
      }
      
      Create distinct teaching logic for L1 (Basic mechanics), L2 (Advanced efficiency), and L3 (Combat application) for EACH variation.`;

      const promptText = `Generate 3 distinct combat tactical combo variations based on these base actions: ${packTitles}. Ensure each combination is unique and practical.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: promptText }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty AI response");
      
      const data = JSON.parse(text);
      
      if (!data.variations || !Array.isArray(data.variations)) {
        throw new Error("Invalid JSON structure returned by AI");
      }

      const variations: GeneratedVariation[] = data.variations.map((v: any, idx: number) => ({
        id: `combo_${Date.now()}_${idx}`,
        title: v.title || `AI 组合方案 ${idx+1}`,
        category: v.category || "战术组合",
        origin: 'private',
        can_edit: true,
        selected: idx === 0, // Default select the first one
        levels: {
          l1: { 
            steps: v.levels?.l1?.steps || [], 
            points: v.levels?.l1?.points || [], 
            methods: [], 
            actions: [] 
          },
          l2: { 
            steps: v.levels?.l2?.steps || [], 
            points: v.levels?.l2?.points || [], 
            methods: [], 
            actions: [] 
          },
          l3: { 
            steps: v.levels?.l3?.steps || [], 
            points: v.levels?.l3?.points || [], 
            methods: [], 
            actions: [] 
          }
        }
      }));

      setGeneratedVariations(variations);
    } catch (e: any) {
      console.error("AI Combo Gen Error:", e);
      const msg = e.message || "Unknown error";
      alert(`AI 组合生成失败: ${msg}. 请重试。`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleVariationSelection = (idx: number) => {
    setGeneratedVariations(prev => prev.map((v, i) => i === idx ? { ...v, selected: !v.selected } : v));
  };

  const updateVariationTitle = (idx: number, newTitle: string) => {
    setGeneratedVariations(prev => prev.map((v, i) => i === idx ? { ...v, title: newTitle } : v));
  };

  const handleSaveSelected = () => {
    const selected = generatedVariations.filter(v => v.selected);
    if (selected.length === 0) return;
    // Remove the 'selected' property before saving to comply with TechPack type
    const cleanPacks: TechPack[] = selected.map(({ selected, ...rest }) => rest);
    onSave(cleanPacks);
  };

  const selectedCount = generatedVariations.filter(v => v.selected).length;

  return (
    <div className="fixed inset-0 bg-[#000000] z-[250] flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="pt-16 px-6 pb-6 border-b border-white/10 bg-[#000000]/95 backdrop-blur-md sticky top-0 z-20 flex justify-between items-end">
        <div>
           <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[4px] mb-1 italic">Tactical Neural Link</p>
           <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">AI 智能组合实验室</h2>
        </div>
        <button onClick={onCancel} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93] active:scale-90 transition-all">✕</button>
      </div>

      <div className="p-6 pb-40">
        {generatedVariations.length === 0 ? (
          <div className="animate-in fade-in duration-700">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6 ml-1">
                 <div className="w-1 h-3 bg-[#E60012]"></div>
                 <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">STEP 1: 选择核心基础动作 (SELECT BASICS)</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {existingLibrary.map(pack => {
                  const isSelected = selectedIds.includes(pack.id);
                  return (
                    <button 
                      key={pack.id} 
                      onClick={() => toggleSelection(pack.id)}
                      className={`
                        p-5 rounded-[20px] border text-left transition-all relative overflow-hidden group
                        ${isSelected ? 'bg-[#E60012] border-[#E60012] text-white' : 'bg-[#1A1A1A] border-white/5 text-[#8E8E93]'}
                      `}
                    >
                      <span className="text-[7px] font-black uppercase block opacity-40 mb-1 tracking-widest">{pack.category}</span>
                      <span className="font-bold text-sm block leading-tight tracking-tight">{pack.title}</span>
                      {isSelected ? (
                         <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full flex items-center justify-center animate-in zoom-in">
                            <span className="text-[#E60012] text-[8px]">✓</span>
                         </div>
                      ) : (
                         <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white/20"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 flex items-start gap-4 mb-20 opacity-60">
               <div className="text-xl">💡</div>
               <p className="text-[10px] text-[#8E8E93] leading-relaxed italic">
                 AI 将根据您选择的基础动作，通过格斗逻辑算法生成 3 套具备实操价值的“战术组合方案”。
               </p>
            </div>

            <div className="fixed bottom-10 left-6 right-6">
               <button 
                 onClick={handleGenerate}
                 disabled={selectedIds.length < 2 || isGenerating}
                 className={`w-full py-5 rounded-full font-oswald text-xl uppercase tracking-[4px] shadow-2xl transition-all ${selectedIds.length < 2 ? 'bg-[#1A1A1A] text-[#8E8E93] opacity-30 cursor-not-allowed' : 'bg-[#E60012] text-white animate-breathe'}`}
               >
                 {isGenerating ? '正在同步神经网络...' : `智能生成组合方案 (GENERATE)`}
               </button>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
             <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 ml-1">
                   <div className="w-1 h-3 bg-green-500"></div>
                   <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">STEP 2: 方案筛选与微调 (REVIEW & FILTER)</p>
                </div>
                
                <div className="space-y-6">
                  {generatedVariations.map((variation, idx) => (
                    <div 
                      key={variation.id}
                      className={`
                        rounded-[32px] p-6 border transition-all relative overflow-hidden
                        ${variation.selected ? 'bg-[#1A1A1A] border-[#E60012]/50 shadow-[0_0_30px_rgba(230,0,18,0.1)]' : 'bg-black border-white/10 opacity-60 grayscale'}
                      `}
                    >
                       <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 mr-4">
                             <div className="flex items-center gap-3 mb-2">
                                <button 
                                  onClick={() => toggleVariationSelection(idx)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${variation.selected ? 'bg-[#E60012] border-[#E60012] text-white' : 'bg-transparent border-white/30'}`}
                                >
                                  {variation.selected && <span className="text-[10px]">✓</span>}
                                </button>
                                <span className="text-[#E60012] text-[9px] font-black uppercase tracking-widest">OPTION 0{idx+1}</span>
                             </div>
                             <input 
                               value={variation.title} 
                               onChange={e => updateVariationTitle(idx, e.target.value)}
                               className={`w-full bg-transparent text-xl font-oswald uppercase italic tracking-tight border-b pb-1 outline-none transition-colors ${variation.selected ? 'text-white border-white/20 focus:border-[#E60012]' : 'text-[#8E8E93] border-transparent pointer-events-none'}`}
                               disabled={!variation.selected}
                             />
                          </div>
                       </div>

                       {variation.selected && (
                         <div className="space-y-4 animate-in fade-in">
                            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-[8px] font-black uppercase text-white bg-[#E60012] px-2 py-0.5 rounded italic">L1 基础逻辑</span>
                                </div>
                                <div className="space-y-2">
                                   {variation.levels.l1.steps.slice(0, 3).map((s, i) => (
                                      <p key={i} className="text-[10px] text-[#F2F2F2] leading-relaxed opacity-80 pl-2 border-l border-white/10">{s}</p>
                                   ))}
                                </div>
                            </div>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             </div>

             <div className="fixed bottom-10 left-6 right-6 flex flex-col gap-3">
               <button 
                 onClick={handleSaveSelected}
                 disabled={selectedCount === 0}
                 className={`w-full py-5 rounded-full font-oswald text-lg uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all ${selectedCount > 0 ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#8E8E93] opacity-50'}`}
               >
                 保存选中的 {selectedCount} 个方案
               </button>
               <button 
                 onClick={() => setGeneratedVariations([])}
                 className="w-full py-4 rounded-full bg-transparent text-[#8E8E93] font-black text-[10px] uppercase tracking-[3px] hover:text-white transition-colors"
               >
                 放弃并重新生成
               </button>
             </div>
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-[#E60012]/10 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-[#E60012] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-[#E60012]/40 rounded-full animate-spin [animation-duration:1.5s]"></div>
           </div>
           <p className="text-white font-oswald text-xl uppercase italic tracking-[6px] animate-pulse">Neural Linking...</p>
           <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-[4px] mt-4 opacity-60">AI 正在根据格斗力学构建最优教案</p>
        </div>
      )}
    </div>
  );
};

export default ComboEditor;
