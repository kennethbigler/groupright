//
//  FirstViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/18/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "UpdatesViewController.h"
#import "LoginViewController.h"
#import "GRMainModule.h"
#import "UpdatesTableCell.h"
#import "GRMainModule.h"

@interface UpdatesViewController ()

@end

@implementation UpdatesViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)viewDidAppear:(BOOL)animated
{
    GRMainModule *grmm = [GRMainModule grMain];
    

    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    //LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    //[self presentViewController:lvc animated:NO completion:nil];
    [_UpdatesTable reloadData];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


// =============================================================================================
//  Updates Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    GRMainModule *grmm = [GRMainModule grMain];
    return [grmm.updates count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    static NSString *cellID = @"UpdateCell";
    
    //Get a new or recycled cell
    UpdatesTableCell *cell = (UpdatesTableCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"UpdatesTableCell" owner:self options:nil];

        cell = (UpdatesTableCell*)[nib objectAtIndex:0];
    }
    
    //Set Name and Description
    cell.nameLabel.text = [grmm getFullNameForEmail:[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"email"]];
    cell.infoLabel.text = [[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"description"];
    
    //Set the correct photo
    if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"event"]){
        cell.thumbnailImageView.image = [UIImage imageNamed:@"cal.png"];

    }
    else if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"task"]){
        cell.thumbnailImageView.image = [UIImage imageNamed:@"task.png"];
    }
    else {
        cell.thumbnailImageView.image = [UIImage imageNamed:@"default.png"];
    }
    
    //Set the background color
    NSDictionary *update =[grmm.updates objectAtIndex:indexPath.row];
    NSString *guid =[update objectForKey:@"group_id"];
    cell.backgroundColor=[grmm getColorForGroupWithId:guid];
    
    return cell;
}

- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}


@end
