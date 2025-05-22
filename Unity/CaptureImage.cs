using UnityEngine;
using UnityEngine.Windows.WebCam;
using System.IO;

public class CaptureImage : MonoBehaviour
{
    PhotoCapture photoCaptureObject = null;
    public AzureOCR AzureOCR;
    string savedFilePath = "";

    public void TakePhoto()
    {
        PhotoCapture.CreateAsync(false, OnPhotoCaptureCreated);
    }

    void OnPhotoCaptureCreated(PhotoCapture captureObject)
    {
        photoCaptureObject = captureObject;

        var resEnum = PhotoCapture.SupportedResolutions.GetEnumerator();
        resEnum.MoveNext();
        Resolution cameraResolution = resEnum.Current;

        CameraParameters camParams = new CameraParameters
        {
            hologramOpacity = 1.0f,
            cameraResolutionWidth = cameraResolution.width,
            cameraResolutionHeight = cameraResolution.height,
            pixelFormat = CapturePixelFormat.BGRA32
        };

        photoCaptureObject.StartPhotoModeAsync(camParams, OnPhotoModeStarted);
    }

    void OnPhotoModeStarted(PhotoCapture.PhotoCaptureResult result)
    {
        if (result.success)
        {
            string filename = $"Photo_{Time.time:F2}.jpg";
            savedFilePath = Path.Combine(Application.persistentDataPath, filename);
            photoCaptureObject.TakePhotoAsync(savedFilePath, PhotoCaptureFileOutputFormat.JPG, OnCapturedPhotoToDisk);
        }
        else
        {
            Debug.LogError("Failed to start photo mode.");
        }
    }

    void OnCapturedPhotoToDisk(PhotoCapture.PhotoCaptureResult result)
    {
        if (result.success)
        {
            Debug.Log("Photo saved successfully!");
            Debug.Log($"File location: {savedFilePath}");
            AzureOCR.StartOCR(savedFilePath);
        }
        else
        {
            Debug.LogError("Photo save failed.");
        }

        photoCaptureObject.StopPhotoModeAsync(OnPhotoModeStopped);
    }

    void OnPhotoModeStopped(PhotoCapture.PhotoCaptureResult result)
    {
        photoCaptureObject.Dispose();
        photoCaptureObject = null;
    }
}
