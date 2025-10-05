import cv2
import time
from cvzone.HandTrackingModule import HandDetector
import pyautogui

WEBCAM_WIDTH, WEBCAM_HEIGHT = 1280, 720
ACTION_COOLDOWN = 0.5

cap = cv2.VideoCapture(0)
cap.set(3, WEBCAM_WIDTH)
cap.set(4, WEBCAM_HEIGHT)

detector = HandDetector(detectionCon=0.8, maxHands=2)

last_action_time = {
    "left": 0,
    "right": 0,
    "jump": 0,
    "action": 0
}

while True:
    success, img = cap.read()
    if not success:
        break

    img = cv2.flip(img, 1)
    
    hands, img = detector.findHands(img)
    current_time = time.time()

    if hands:
        for hand in hands:
            fingers = detector.fingersUp(hand)
            finger_count = fingers.count(1)
            hand_type = hand["type"]

            # Display the finger count for each hand
            if hand_type == "Right":
                cv2.putText(img, f'Fingers: {finger_count}', (WEBCAM_WIDTH - 250, WEBCAM_HEIGHT - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 255), 2)
            if hand_type == "Left":
                cv2.putText(img, f'Fingers: {finger_count}', (50, WEBCAM_HEIGHT - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 255), 2)

            # --- Right Hand Controls ---
            if hand_type == "Right":
                # Gesture: Move Right (Open hand)
                if finger_count == 5 and (current_time - last_action_time["right"] > ACTION_COOLDOWN):
                    pyautogui.press("right")
                    cv2.putText(img, "ACTION: MOVE RIGHT", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    last_action_time["right"] = current_time

                # Gesture: Jump (Index finger)
                elif finger_count == 1 and fingers[1] == 1 and (current_time - last_action_time["jump"] > ACTION_COOLDOWN):
                    pyautogui.press("up")
                    cv2.putText(img, "ACTION: JUMP", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    last_action_time["jump"] = current_time
                
                # Gesture: Action/Shoot (Fist)
                elif finger_count == 0 and (current_time - last_action_time["action"] > ACTION_COOLDOWN):
                    pyautogui.press("space")
                    cv2.putText(img, "ACTION: SHOOT / USE", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    last_action_time["action"] = current_time

            # --- Left Hand Controls ---
            if hand_type == "Left":
                # Gesture: Move Left (Open hand)
                if finger_count == 5 and (current_time - last_action_time["left"] > ACTION_COOLDOWN):
                    pyautogui.press("left")
                    cv2.putText(img, "ACTION: MOVE LEFT", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    last_action_time["left"] = current_time

    cv2.imshow("Gesture Controller", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()