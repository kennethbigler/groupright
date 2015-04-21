//
//  GRMainModule.h
//  GroupRight
//
//  Created by Scott on 4/21/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GRMainModule : NSObject
{
    
}

@property (strong) NSString *user;
@property (strong) NSString *ac;

@property (strong) NSString *fname;
@property (strong) NSString *lname;

@property (strong) NSMutableArray *groups;
@property (strong) NSMutableArray *events;
@property (strong) NSMutableArray *tasks;
@property (strong) NSMutableArray *updates;
@property (strong) NSMutableArray *messages;

/* constructor */
+ (GRMainModule *) grMain;

/* loading / parsing data */
- (void) addUserData: (NSDictionary *) raw;


@end
