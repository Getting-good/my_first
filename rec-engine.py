#!/usr/bin/python3
# This script serves as a proof of concept for a basic recommendation 
# engine model. The user is presented with a sequence of yes/no questions 
# which are then used to determine which majors the user may have more 
# affinity towards.
#
# @author Jacob Harvey
# @date   2023/07/31
import sys

# Updates user affinities based on given weights. Affinity is added 
# for positive responses and deducted for negative responses
def updateAffinities(userAffinities, promptAffinity, isPositive):
    if (isPositive):
        for i in range(0, len(userAffinities)):
            userAffinities[i] += promptAffinity[i]
    else:
        for i in range(0, len(userAffinities)):
            userAffinities[i] -= promptAffinity[i]
    
    return userAffinities

# Identifies the major with the highest user affinity
# NOTE: There is currently no logic for tie-breaking, so the index of the
# first occurence of maxAffinity is returned if there is more than one
def findBestMatch(userAffinities, majors):
    # Assume at least one major exists,
    # otherwise what are we even doing here?
    maxAffinity = userAffinities[0]
    maxIndex = 0
    
    for i in range(0, len(userAffinities)):
        if (userAffinities[i] > maxAffinity):
            maxAffinity = userAffinities[i]
            maxIndex = i

    return maxIndex

# Prompts presented to the user
prompts = [
    "I need the freedom to be creative and express myself.",
    "I care about the state of the environment and want to help improve it in my career.",
    "I like to give advice.",
    "I am interested in rehabilitating and healing people.",
    "I am very ambitious, persuasive and love coming up with new ideas.",    
    "I enjoy learning about different parts of the world.",
    "I like math and figuring out how things work.",
]

# Affinity weights for each prompt
# Each subarray is a mapping of affinity weights in the same order
# as user affinities below. Order must be preserved
promptAffinities = [
    [1, 0, 0, 1, 0, 2, 2, 3],
    [0, 0, 0, 0, 2, 0, 3, 0],
    [1, 3, 0, 1, 0, 0, 0, 2],
    [0, 3, 0, 0, 2, 0, 0, 0],
    [1, 0, 3, 0, 0, 0, 2, 2],
    [0, 0, 2, 0, 0, 3, 2, 1],
    [3, 0, 0, 3, 2, 0, 0, 0],
]

# User's current affinity for each major
# Baseline is 10 since affinity can be both increased and decreased
userAffinities = [
    10, # Computer Science
    10, # Psychology
    10, # Business Administration
    10, # Mechanical Engineering
    10, # Biology
    10, # Art History
    10, # Environmental Science
    10, # Journalism
]

# A 1-1 mapping of available majors to user affinities
# Order from above must be preserved here
majors = [
    "Computer Science",
    "Psychology",
    "Business Administration",
    "Mechanical Engineering",
    "Biology",
    "Art History",
    "Environmental Science",
    "Journalism",
]

# Set debug mode based on command line opts
debug = False

if (len(sys.argv) > 1):
    if (sys.argv[1] == "-h"):
        print("usage: " + sys.argv[0] + " [-h] [-d]")
        exit(0)
    elif (sys.argv[1] == "-d"):
        debug = True

# Main quiz loop
promptIndex = 0
validAnswer = False;

for prompt in prompts:
    # Reprompt user if they give invalid input (not [y/n])
    while (not validAnswer):
        print(prompt + " [y/n] ", end="")
        answer = input().lower()
        
        if (answer == "y" or answer == "yes"):
            # Add affinity
            userAffinities = updateAffinities(userAffinities, promptAffinities[promptIndex], True)
            validAnswer = True
        elif (answer == "n" or answer == "no"):
            # Deduct affinity
            userAffinities = updateAffinities(userAffinities, promptAffinities[promptIndex], False)
            validAnswer = True

    if (debug):
        print("DEBUG: affinities updated")
        print(userAffinities)
    
    validAnswer = False
    promptIndex += 1

# Report top major based on final user affinities
bestIndex = findBestMatch(userAffinities, majors)
print("\nYou might be interested in: " + majors[bestIndex])

