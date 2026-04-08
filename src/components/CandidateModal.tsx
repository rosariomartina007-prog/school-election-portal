import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { X, Upload } from "lucide-react";
import { Candidate } from "../types";

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: Candidate) => void;
  candidate?: Candidate | null;
}

export const CandidateModal = ({
  isOpen,
  onClose,
  onSave,
  candidate,
}: CandidateModalProps) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [classValue, setClassValue] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setPosition(candidate.position);
      setClassValue(candidate.class);
      setGender(candidate.gender);
      setHobbies(candidate.hobbies);
      setImage(candidate.image);
      setImagePreview(candidate.image);
    } else {
      resetForm();
    }
  }, [candidate, isOpen]);

  const resetForm = () => {
    setName("");
    setPosition("");
    setClassValue("");
    setGender("");
    setHobbies("");
    setImage("");
    setImagePreview("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !position || !classValue || !gender) {
      alert("Please fill in all required fields");
      return;
    }
    if (!candidate && !image) {
      alert("Please upload a photo");
      return;
    }

    const newCandidate: Candidate = {
      id: candidate?.id || Date.now().toString(),
      adminId: candidate?.adminId || "",
      name,
      position,
      class: classValue,
      gender,
      hobbies,
      image,
      votes: candidate?.votes || 0,
    };

    onSave(newCandidate);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {candidate ? "Edit Candidate" : "Add New Candidate"}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter candidate name"
            />
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., President, Vice President, Head Boy, Head Girl"
            />
          </div>

          <div>
            <Label htmlFor="class">Class *</Label>
            <Input
              id="class"
              value={classValue}
              onChange={(e) => setClassValue(e.target.value)}
              placeholder="e.g., 10A, 12B"
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hobbies">Hobbies (Optional)</Label>
            <Input
              id="hobbies"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="e.g., Reading, Sports, Music"
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo *</Label>
            <div className="mt-2">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-slate-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Click to upload photo</p>
                    <p className="text-xs text-slate-400">Max 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-purple-500 hover:bg-purple-600">
              {candidate ? "Update" : "Add"} Candidate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};