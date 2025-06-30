package com.example.pafbackend.services;

import com.example.pafbackend.models.AppUser;
import com.example.pafbackend.models.Follow;
import com.example.pafbackend.repositories.AppUserRepository;
import com.example.pafbackend.repositories.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    public String followUser(String followerId, String followingId) {
        if (followerId.equals(followingId)) {
            return "You cannot follow yourself.";
        }

        Optional<AppUser> followerOpt = appUserRepository.findById(followerId);
        Optional<AppUser> followingOpt = appUserRepository.findById(followingId);

        if (followerOpt.isEmpty() || followingOpt.isEmpty()) {
            return "User not found.";
        }

        Optional<Follow> existing = followRepository.findByFollowerAndFollowing(followerOpt.get(), followingOpt.get());
        if (existing.isPresent()) {
            return "Already following.";
        }

        Follow follow = new Follow(followerOpt.get(), followingOpt.get());
        followRepository.save(follow);
        return "Followed successfully.";
    }

    public String unfollowUser(String followerId, String followingId) {
        Optional<AppUser> followerOpt = appUserRepository.findById(followerId);
        Optional<AppUser> followingOpt = appUserRepository.findById(followingId);

        if (followerOpt.isEmpty() || followingOpt.isEmpty()) {
            return "User not found.";
        }

        Optional<Follow> follow = followRepository.findByFollowerAndFollowing(followerOpt.get(), followingOpt.get());
        if (follow.isPresent()) {
            followRepository.delete(follow.get());
            return "Unfollowed successfully.";
        } else {
            return "Not following.";
        }
    }

    public long getFollowingCount(String userId) {
        return appUserRepository.findById(userId)
                .map(user -> followRepository.countByFollower(user))
                .orElse(0L);
    }

    public long getFollowerCount(String userId) {
        return appUserRepository.findById(userId)
                .map(user -> followRepository.countByFollowing(user))
                .orElse(0L);
    }
    public boolean isFollowing(String followerId, String followingId) {
        Optional<AppUser> followerOpt = appUserRepository.findById(followerId);
        Optional<AppUser> followingOpt = appUserRepository.findById(followingId);

        if (followerOpt.isEmpty() || followingOpt.isEmpty()) {
            return false;
        }

        return followRepository.findByFollowerAndFollowing(followerOpt.get(), followingOpt.get()).isPresent();
    }

}
