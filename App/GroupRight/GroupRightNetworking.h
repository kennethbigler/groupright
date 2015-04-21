//
//  GroupRightNetworking.h
//  GroupRight
//
//  Created by Zachary Wilson on 4/20/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GroupRightNetworking : NSObject
+(NSData *)postDataToGroupServe:(NSString*)jsonString;
+(NSString*)loginToGroupServeWithUsername:(NSString*)username andPassword:(NSString*)password;
@end
