import cv2

# Open the video file
# video = cv2.VideoCapture("path/to/video.mp4")

# Set up the webcam feed
webcam = cv2.VideoCapture(0)
webcam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
webcam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

showret, showFrame = webcam.read()

while True:
    # Read a frame from the video file
    # ret, frame = video.read()

    # If the video has ended, start from the beginning
    # if not ret:
    #     video.set(cv2.CAP_PROP_POS_FRAMES, 0)
    #     continue

    # Set the frame as the webcam feed
    webcam.write(showFrame)

    # Show the webcam feed
    cv2.imshow("Webcam", showFrame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close the window
webcam.release()
cv2.destroyAllWindows()
