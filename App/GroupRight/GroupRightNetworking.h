//
//  GroupRightNetworking.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/20/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GroupRightNetworking : NSObject
+(void) getUserInfo;
+(NSString*)loginToGroupServeWithUsername:(NSString*)username andPassword:(NSString*)password;
+(void) logoutOfGroupServeWithUsername:(NSString*)username andCookier:(NSString*)ac;
+(void) markTaskCompleteWithTaskId:(NSString*)task_id;
+(void) getMessagesForGroupId:(NSString*)group_id;
@end
