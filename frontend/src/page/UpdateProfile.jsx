import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { User, Mail, Lock, Eye, EyeOff, Save, Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateFailure, updateStart, updateSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import SideBar from "@/components/Sidebar"

const UpdateProfile = () => {
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [updateUser, setUpdateUser] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const { currentUser, loading } = useSelector((state) => state.user)
  const { uid } = useParams()
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ✅ FIX: navigation moved to useEffect
  useEffect(() => {
    if (!currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  // ---------------- IMAGE HANDLING ----------------

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file) => {
    try {
      setImageFileUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append("image", file)

      const res = await api.post("/api/v1/user/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const imageUrl = res.data.url

      setImageUrl(imageUrl)

      setUpdateUser((prev) => ({
        ...prev,
        profilePicture: imageUrl,
      }))

      setImageFileUploading(false)
    } catch (error) {
      setUploadError("Image upload failed")
      setImageFileUploading(false)
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile)
    }
  }, [imageFile])

  // ---------------- FORM HANDLERS ----------------

  const handleOnChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.id]: e.target.value })
  }

  const handleUpdateUser = async () => {
    setUpdateUserError(null)
    setUpdateUserSuccess(null)

    if (Object.keys(updateUser).length === 0) {
      setUpdateUserError("No changes made.")
      return
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload")
      return
    }

    try {
      dispatch(updateStart())

      // ✅ FIX: proper API path
      const { data } = await api.patch(
        `/api/v1/user/update-profile/${uid}`,
        updateUser
      )

      dispatch(updateSuccess(data))
      setUpdateUserSuccess("Profile updated successfully!")
    } catch (error) {
      const msg = error?.response?.data?.msg || "Something went wrong"
      dispatch(updateFailure(msg))
      setUpdateUserError(msg)
    }
  }

  // ---------------- AUTO CLEAR ALERTS ----------------

  useEffect(() => {
    if (!updateUserSuccess && !updateUserError) return

    const timer = setTimeout(() => {
      setUpdateUserSuccess(null)
      setUpdateUserError(null)
    }, 4000)

    return () => clearTimeout(timer)
  }, [updateUserSuccess, updateUserError])

  // ---------------- UI ----------------

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      <SideBar />

      <div className="flex-1 p-6">

        {/* Alerts */}
        {uploadError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{uploadError}</p>
          </div>
        )}

        {updateUserSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">{updateUserSuccess}</p>
          </div>
        )}

        {updateUserError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{updateUserError}</p>
          </div>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>Make changes to your profile here</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer border-4 border-background shadow-lg"
                  onClick={() => fileRef.current.click()}
                >
                  <AvatarImage src={imageUrl || currentUser?.profilePicture} />
                  <AvatarFallback>
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div
                  className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full cursor-pointer"
                  onClick={() => fileRef.current.click()}
                >
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </div>

              <input
                type="file"
                ref={fileRef}
                onChange={handleImageFile}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Inputs */}
            <div className="space-y-4">

              <div>
                <Label>Username</Label>
                <Input id="username" defaultValue={currentUser.username} onChange={handleOnChange} />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={currentUser.email} readOnly disabled />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleOnChange}
                />
              </div>

            </div>

            <Button
              onClick={handleUpdateUser}
              className="w-full"
              disabled={loading || imageFileUploading}
            >
              {loading || imageFileUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UpdateProfile